const fs = require('fs-extra');

export function readJson(path) {
	return new Promise((res, rej) => {
		fs.open(path, 'r', (err, fd) => {
			if (err !== null) {
				console.error('jsonrw: readJson: open:', err);
				rej(err);
			}
			fs.readFile(fd, 'utf-8', (err, data) => {
				if (err !== null) {
					fs.close(fd);
					rej(err);
				}
				fs.close(fd);
				res(JSON.parse(data.split('\n')[0]));
			});
		});
	});
}

export function writeJson(path, obj) {
	return new Promise((res, rej) => {
		fs.writeJson(path, obj, err => {
			if (err) throw err;
			res(obj);
		});
		// const content = JSON.stringify(obj, null, 4);
		// console.log(content);
		// fs.writeFile(path + '.tmp', content, 'utf8', function (err) {
		// 	if (err !== null) {
		// 		rej(err);
		// 	}
		// }); 
		// fs.open(path, 'w', (err, fd) => {
		// 	if (err !== null) {
		// 		console.error('jsonrw: writeJson: open:', err);
		// 		rej(err);
		// 	}
		// 	fs.writeFile(fd, content, 'utf8', function (err) {
		// 	    if (err !== null) {
		// 	    	fs.close(fd);
		// 	    	rej(err);
		// 	    }
		// 	    fs.close(fd);
		// 	    res(obj);
		// 	}); 
		// });
	})
}
