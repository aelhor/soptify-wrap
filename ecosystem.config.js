module.exports = {
  apps: [{
    name: "Lawhaty",
    script: './dist/src/main.js',
    error_file: "./logs/err-" + currentDate() + ".log",
    out_file: "./logs/log-" + currentDate() + ".log",
    log_date_format: "YYYY-MM-DD HH:mm Z",
    time: true,
    /*exec_mode: "cluster",
    instances: "max",
    instance_var: 'INSTANCE_ID',
    env: {
      "PORT": 3000,
      "NODE_ENV": "production"
    }*/
  }],
};

function currentDate() {
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  return date;
}
