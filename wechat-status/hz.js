const UserStatus = require('../model/userStatus');
const User = require('../model/user');
const constant = require('../config/constant');
const Validate = require('../tool/validate');
const async = require('async');

class Wszl {
    constructor() {
      this.validate = new Validate();
      this.realType = [{type: 'text'}];
    }

  showText() {
    return {type:'text', info: '请输入合作的邮箱地址'};
  }

  handler(userId, str, type, callback) {
    async.waterfall([
      (done) => {
        User.create({userId: userId, name: str}, done);
      },
      (data, done) => {
        if (this.validate.check(type, this.realType)) {
          UserStatus.update({userId: userId},{status:'email'}, done);
        } else {
          done(null, {text: constant.validate.err});
        }
      }
    ],(err, data) => {
      if (err) {
        return callback(err, null);
      }
      if (data.text) {
        return callback(null, data.text);
      }
      return callback(null, this.showText());
    });
  }
}

module.exports = Wszl;