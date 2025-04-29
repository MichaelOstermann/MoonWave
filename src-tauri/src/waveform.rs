use std::fs::File;
use std::path::Path;
use symphonia::core::audio::{AudioBufferRef, Signal};
use symphonia::core::codecs::{DecoderOptions, CODEC_TYPE_NULL};
use symphonia::core::errors::Error as SymphoniaError;
use symphonia::core::formats::FormatOptions;
use symphonia::core::io::MediaSourceStream;
use symphonia::core::meta::MetadataOptions;
use symphonia::core::probe::Hint;

pub fn generate_waveform(file_path: &str) -> Result<Vec<f64>, String> {
    // Open the audio file
    let file = File::open(file_path).map_err(|e| format!("Failed to open file: {}", e))?;

    let mss = MediaSourceStream::new(Box::new(file), Default::default());

    // Create a hint to help the format registry guess the format
    let mut hint = Hint::new();
    if let Some(extension) = Path::new(file_path).extension() {
        if let Some(ext_str) = extension.to_str() {
            hint.with_extension(ext_str);
        }
    }

    // Probe the media source for a format
    let probed = symphonia::default::get_probe()
        .format(
            &hint,
            mss,
            &FormatOptions::default(),
            &MetadataOptions::default(),
        )
        .map_err(|e| format!("Failed to probe file: {}", e))?;

    let mut format = probed.format;

    // Find the first audio track
    let track = format
        .tracks()
        .iter()
        .find(|t| t.codec_params.codec != CODEC_TYPE_NULL)
        .ok_or("No audio track found")?;

    let track_id = track.id;

    // Create a decoder for the track
    let mut decoder = symphonia::default::get_codecs()
        .make(&track.codec_params, &DecoderOptions::default())
        .map_err(|e| format!("Failed to create decoder: {}", e))?;

    // Sample rate for resampling
    let sample_rate = track.codec_params.sample_rate.unwrap_or(44100);
    let target_samples = 4000;

    // Calculate samples per chunk
    let total_frames = track.codec_params.n_frames.unwrap_or(0);
    let samples_per_chunk = if total_frames > 0 {
        (total_frames as f64 / target_samples as f64).max(1.0) as usize
    } else {
        (sample_rate as usize * 10) / target_samples // Fallback: assume 10 seconds
    };

    let mut peaks = Vec::new();
    let mut chunk_samples = Vec::new();

    // Decode and process audio packets
    loop {
        let packet = match format.next_packet() {
            Ok(packet) => packet,
            Err(SymphoniaError::IoError(e)) if e.kind() == std::io::ErrorKind::UnexpectedEof => {
                break;
            }
            Err(e) => return Err(format!("Failed to read packet: {}", e)),
        };

        // Skip packets that aren't for our track
        if packet.track_id() != track_id {
            continue;
        }

        // Decode the packet into audio samples
        match decoder.decode(&packet) {
            Ok(decoded) => {
                // Extract samples and calculate peaks
                let samples = extract_samples(&decoded);

                for sample in samples {
                    chunk_samples.push(sample);

                    // When we have enough samples, calculate peak for this chunk
                    if chunk_samples.len() >= samples_per_chunk {
                        let peak = calculate_peak(&chunk_samples);
                        peaks.push(peak);
                        chunk_samples.clear();
                    }
                }
            }
            Err(SymphoniaError::DecodeError(_)) => continue,
            Err(e) => return Err(format!("Failed to decode packet: {}", e)),
        }
    }

    // Handle remaining samples
    if !chunk_samples.is_empty() {
        let peak = calculate_peak(&chunk_samples);
        peaks.push(peak);
    }

    // Apply post-processing
    let peaks = log_to_linear_peaks(peaks);
    let peaks = upscale_peaks(peaks);
    let peaks = reduce_precision(peaks);

    Ok(peaks)
}

// Extract samples from an audio buffer (converts to mono by averaging channels)
fn extract_samples(decoded: &AudioBufferRef) -> Vec<f32> {
    match decoded {
        AudioBufferRef::F32(buf) => {
            let channels = buf.spec().channels.count();
            let frames = buf.frames();
            let mut samples = Vec::with_capacity(frames);

            for frame_idx in 0..frames {
                let mut sum = 0.0f32;
                for ch in 0..channels {
                    sum += buf.chan(ch)[frame_idx];
                }
                samples.push(sum / channels as f32);
            }
            samples
        }
        AudioBufferRef::U8(buf) => {
            let channels = buf.spec().channels.count();
            let frames = buf.frames();
            let mut samples = Vec::with_capacity(frames);

            for frame_idx in 0..frames {
                let mut sum = 0.0f32;
                for ch in 0..channels {
                    // Convert u8 to f32 [-1.0, 1.0]
                    let normalized = (buf.chan(ch)[frame_idx] as f32 - 128.0) / 128.0;
                    sum += normalized;
                }
                samples.push(sum / channels as f32);
            }
            samples
        }
        AudioBufferRef::U16(buf) => {
            let channels = buf.spec().channels.count();
            let frames = buf.frames();
            let mut samples = Vec::with_capacity(frames);

            for frame_idx in 0..frames {
                let mut sum = 0.0f32;
                for ch in 0..channels {
                    // Convert u16 to f32 [-1.0, 1.0]
                    let normalized = (buf.chan(ch)[frame_idx] as f32 - 32768.0) / 32768.0;
                    sum += normalized;
                }
                samples.push(sum / channels as f32);
            }
            samples
        }
        AudioBufferRef::U24(buf) => {
            let channels = buf.spec().channels.count();
            let frames = buf.frames();
            let mut samples = Vec::with_capacity(frames);

            for frame_idx in 0..frames {
                let mut sum = 0.0f32;
                for ch in 0..channels {
                    // Convert u24 to f32 [-1.0, 1.0]
                    let normalized =
                        (buf.chan(ch)[frame_idx].inner() as f32 - 8388608.0) / 8388608.0;
                    sum += normalized;
                }
                samples.push(sum / channels as f32);
            }
            samples
        }
        AudioBufferRef::U32(buf) => {
            let channels = buf.spec().channels.count();
            let frames = buf.frames();
            let mut samples = Vec::with_capacity(frames);

            for frame_idx in 0..frames {
                let mut sum = 0.0f32;
                for ch in 0..channels {
                    // Convert u32 to f32 [-1.0, 1.0]
                    let normalized = (buf.chan(ch)[frame_idx] as f32 - 2147483648.0) / 2147483648.0;
                    sum += normalized;
                }
                samples.push(sum / channels as f32);
            }
            samples
        }
        AudioBufferRef::S8(buf) => {
            let channels = buf.spec().channels.count();
            let frames = buf.frames();
            let mut samples = Vec::with_capacity(frames);

            for frame_idx in 0..frames {
                let mut sum = 0.0f32;
                for ch in 0..channels {
                    // Convert i8 to f32 [-1.0, 1.0]
                    let normalized = buf.chan(ch)[frame_idx] as f32 / 128.0;
                    sum += normalized;
                }
                samples.push(sum / channels as f32);
            }
            samples
        }
        AudioBufferRef::S16(buf) => {
            let channels = buf.spec().channels.count();
            let frames = buf.frames();
            let mut samples = Vec::with_capacity(frames);

            for frame_idx in 0..frames {
                let mut sum = 0.0f32;
                for ch in 0..channels {
                    // Convert i16 to f32 [-1.0, 1.0]
                    let normalized = buf.chan(ch)[frame_idx] as f32 / 32768.0;
                    sum += normalized;
                }
                samples.push(sum / channels as f32);
            }
            samples
        }
        AudioBufferRef::S24(buf) => {
            let channels = buf.spec().channels.count();
            let frames = buf.frames();
            let mut samples = Vec::with_capacity(frames);

            for frame_idx in 0..frames {
                let mut sum = 0.0f32;
                for ch in 0..channels {
                    // Convert i24 to f32 [-1.0, 1.0]
                    let normalized = buf.chan(ch)[frame_idx].inner() as f32 / 8388608.0;
                    sum += normalized;
                }
                samples.push(sum / channels as f32);
            }
            samples
        }
        AudioBufferRef::S32(buf) => {
            let channels = buf.spec().channels.count();
            let frames = buf.frames();
            let mut samples = Vec::with_capacity(frames);

            for frame_idx in 0..frames {
                let mut sum = 0.0f32;
                for ch in 0..channels {
                    // Convert i32 to f32 [-1.0, 1.0]
                    let normalized = buf.chan(ch)[frame_idx] as f32 / 2147483648.0;
                    sum += normalized;
                }
                samples.push(sum / channels as f32);
            }
            samples
        }
        AudioBufferRef::F64(buf) => {
            let channels = buf.spec().channels.count();
            let frames = buf.frames();
            let mut samples = Vec::with_capacity(frames);

            for frame_idx in 0..frames {
                let mut sum = 0.0f64;
                for ch in 0..channels {
                    sum += buf.chan(ch)[frame_idx];
                }
                samples.push((sum / channels as f64) as f32);
            }
            samples
        }
    }
}

// Calculate peak level for a chunk of samples
fn calculate_peak(samples: &[f32]) -> f64 {
    let max_abs = samples.iter().map(|&s| s.abs()).fold(0.0f32, f32::max);

    if max_abs == 0.0 {
        -91.0 // Minimum value for silence (like ffmpeg)
    } else {
        // Convert to dB: 20 * log10(sample)
        20.0 * (max_abs as f64).log10()
    }
}

// Translate peak data from dB to linear range [-1, 1]
fn log_to_linear_peaks(peaks: Vec<f64>) -> Vec<f64> {
    peaks
        .into_iter()
        .map(|peak| {
            if peak == 0.0 {
                0.0
            } else {
                10f64.powf(peak / 20.0)
            }
        })
        .collect()
}

// Apply a virtual gain to make the waveform fill the available height
fn upscale_peaks(peaks: Vec<f64>) -> Vec<f64> {
    let max_peak = peaks.iter().map(|&p| p.abs()).fold(0.0f64, f64::max);

    if max_peak == 0.0 || !max_peak.is_finite() {
        return peaks;
    }

    let upscale = 1.0 / max_peak;
    if !upscale.is_finite() {
        return peaks;
    }

    peaks.into_iter().map(|p| p * upscale).collect()
}

// Reduce the precision of peaks to save disk space
fn reduce_precision(peaks: Vec<f64>) -> Vec<f64> {
    let precision = 10000.0;
    peaks
        .into_iter()
        .map(|p| (p * precision).round() / precision)
        .collect()
}
