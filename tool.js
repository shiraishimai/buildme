const promise = require('bluebird'),
    Version = require('./version'),
    exe = require('simple-exe'),
    path = require('path'),
    fs = require('fs');
class Tool {
    static get LATEST() {return 1;}
    static get EARLIEST() {return 2;}
    static yyyymmdd() {
        let today = new Date();
        return `${today.getYear()+1900}${`0${today.getMonth()+1}`.slice(-2)}${`0${today.getDate()}`.slice(-2)}`;
    }
    static version(versionString) {
        return new Version(versionString);
    }
    static evaluate(...arg) {
        return new promise((resolve, reject) => {
            require('child_process').exec(...arg, (err, stdout) => {
                if (err) return reject(err);
                return resolve(stdout);
            });
        });
    }
    static execute(...arg) {
        return new promise((resolve, reject) => {
            exe(...arg, err => {
                if (err) return reject(err);
                return resolve();
            });
        });
    }
    static cd(dest) {
        return new promise((resolve, reject) => {
            try {
                process.chdir(dest);
                console.log("directory: "+process.cwd());
                resolve();
            } catch (e) {
                console.log(e);
                reject();
            }
        });
    }
    static sortByLatest(dirs) {
        return this.sortBy(dirs);
    }
    static sortByEarliest(dirs) {
        return this.sortBy(dirs, Tool.EARLIEST);
    }
    static sortBy(dirs, config = Tool.LATEST) {
        return this.fsStats(dirs).then(fsStats => {
            return this.sortByStat(fsStats, config);
        });
        // return new Promise((resolve, reject) => {
        //     try {
        //         let sortFn = config === Tool.EARLIEST ? ((a, b) => (a.mtime - b.mtime)) : ((a,b) => (b.mtime - a.mtime)),
        //             result = dirs.map(dir => {
        //                 return {
        //                     'src': dir,
        //                     'mtime': fs.statSync(dir).mtime.getTime()
        //                 };
        //             })
        //             .sort(sortFn)
        //             .map(dir => dir.src);
        //         return resolve(result);
        //     } catch (e) {
        //         return reject(e);
        //     }
        // });
    }
    static sortByStat(statArray, config = Tool.LATEST) {
        let sortFn = config === Tool.EARLIEST ? ((a, b) => (a.mtime - b.mtime)) : ((a,b) => (b.mtime - a.mtime)),
            result = statArray.map(dirStat => {
                return {
                    'dir': dirStat.dir,
                    'mtime': dirStat.stat.mtime.getTime()
                };
            })
            .sort(sortFn)
            .map(dirStat => dirStat.dir);
        return result;
    }
    static fsStats(dirs) {
        let fsStat = promise.promisify(fs.stat);
        return promise.all(dirs.map(dir => {
            return fsStat(dir).then(stat => {
                return {
                    dir,
                    stat
                };
            });
        }));
    }
    static readDir(dir) {
        let readdir = promise.promisify(fs.readdir);
        return readdir(dir).then(files => files.map(file => path.resolve(dir, file)));
    }
}
module.exports = exports = Tool;