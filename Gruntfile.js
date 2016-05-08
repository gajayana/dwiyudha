module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compass: {
            dist : {
                options : {
                    sassDir: 'sources/sass',
					cssDir: 'public/css'
                }
            }
		},
		uglify: {
            all : {
                files : {
                    'public/js/dwiyudha.min.js' : 'sources/script/dwiyudha.js'
                }
            }
		},
		jade: {
		    compile: {
	            options: {
	                client: false,
	                pretty: true
	            },
	            files: [ {
	              cwd: "sources/jade",
	              src: ["**/*.jade", "!**/_*.jade"],
	              dest: "public",
	              expand: true,
	              ext: ".html"
	            } ]
	        }
		},
		watch: {
			javascript : {
                files : 'sources/script/*.js',
                tasks : ['uglify']
            },
            css: {
				files: 'sources/sass/*.scss',
				tasks: ['compass']
			},
			jade: {
			    files: 'sources/jade/**/*.jade',
				tasks: ['jade']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['compass', 'uglify', 'jade', 'watch']);
};
