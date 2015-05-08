var range = function(n) {
    return [Symbol.iterator]:function*() {
        var pre = 0, cur = 1;
        for (let i=0; i<n; i++) {
            yield i;
        }
    };
};