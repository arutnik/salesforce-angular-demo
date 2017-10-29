const gulp = require('gulp');
const run = require('gulp-run');
const watch = require('gulp-watch');
const batch = require('gulp-batch');

gulp.task('deploytosf', () => {
  console.log('Running SF deploy script!')
  return run('ant localDevDeploy -f salesforce/build.xml -lib salesforce/lib').exec('', function(e) {
    if (!(e && e.status)) {
      console.log('Page deployed!');
    }
  });
});

gulp.task('prepareForDeploy', () => {
  console.log('Change detected, preparing to deploy!')
  return run('python salesforce/visualforce_transform.py --assets sftestassets --controller sftestcontroller --pagename sftestpage --builddir src-dev-deploy').exec('', function(e) {
    if (e && e.status) {
      console.log("Pre-prep script failed. NOT DEPLOYING");
      if (exitOnFailure) {
        process.exit(1);
      }
    } else {
      gulp.start('deploytosf');
    }
  })
})

gulp.task('watch', () => {
  watch(['dist', 'dist/**/index.html'] , batch( { timeout: 2000 }, function(events, cb) {
    gulp.start('prepareForDeploy');
    cb();
  }));
});

gulp.task('localWatch', () => {
  setTimeout(() => {
    gulp.start('watch');
  }, 5000);
})

gulp.task('default', ['localWatch']);