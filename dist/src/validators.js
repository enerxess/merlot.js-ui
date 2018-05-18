export function enumValidator(enumArr) {
    return function (control) {
        if (!control.value && control.value !== 0) {
            return null;
        }
        var found = false;
        enumArr.forEach(function (element) {
            // tslint:disable-next-line
            if (element == control.value) {
                found = true;
                return;
            }
        });
        return !found ? { 'enumValidator': { value: control.value } } : null;
    };
}
export function minNumberValidator(testValue) {
    return function (control) {
        if (!control.value) {
            return null;
        }
        return (control.value > testValue) ? { 'minNumber': { value: control.value } } : null;
    };
}
//# sourceMappingURL=validators.js.map