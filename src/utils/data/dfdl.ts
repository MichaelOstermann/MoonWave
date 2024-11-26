export function dfdl<T extends (...args: any[]) => any>(body: T, arity: Parameters<T>['length']) {
    switch (arity) {
        case 1:
            return function (a: any) {
                if (arguments.length >= 1) return body(a)
                return (self: any) => body(self)
            } as any
        case 2:
            return function (a: any, b: any) {
                if (arguments.length >= 2) return body(a, b)
                return (self: any) => body(self, a)
            } as any
        case 3:
            return function (a: any, b: any, c: any) {
                if (arguments.length >= 3) return body(a, b, c)
                return (self: any) => body(self, a, b)
            } as any
        case 4:
            return function (a: any, b: any, c: any, d: any) {
                if (arguments.length >= 4) return body(a, b, c, d)
                return (self: any) => body(self, a, b, c)
            } as any
        default:
            throw new Error(`Invalid arity "${arity}"`)
    }
}
