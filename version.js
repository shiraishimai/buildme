class Version {
    constructor(versionString) {
        this.version = versionString;
    }
    __verUp(index, step) {
        this.version = this.version.split('.').map((ver, i) => {
            if (i<index) return ver;
            if (i===index) return parseInt(ver) + step;
            return 0;
        }).join('.');
    }
    major(step = 1) {
        this.__verUp(0,step);
        return this
    }
    minor(step = 1) {
        this.__verUp(1,step);
        return this;
    }
    patch(step = 1) {
        this.__verUp(2,step);
        return this;
    }
    build(step = 1) {
        this.__verUp(3,step);
        return this;
    }
    getVersion() {
        let ver = this.version.split('.');
        ver.pop();
        return ver.join('.');
    }
    getBuild() {
        return this.version.split('.').pop();
    }
    toString() {
        return this.version;
    }
}
module.exports = exports = Version