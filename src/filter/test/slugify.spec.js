'use strict';

describe('Filter: slugify', function () {

  // load the filter's module
  beforeEach(module('ngTasty.filter.slugify'));

  // initialize a new instance of the filter before each test
  var slugify;
  beforeEach(inject(function ($filter) {
    slugify = $filter('slugify');
  }));

  it('has a slugify filter', function () {
    expect(slugify).not.toBeNull();
  });

  it('should return an empty string if given null object', function () {
    var object = null
    expect(slugify(object)).toBe('');
  });

  it('should remove unwanted characters from string and return slug', function () {
    var text = 'some @#$@text @#!@#here';
    expect(slugify(text)).toBe('some-text-here');
  });

  it('should return slug without duplicate dashes', function () {
    var text = 'some   text       here     ';
    expect(slugify(text)).toBe('some-text-here');
  });

  it('should allow numbers to be present in the slug', function () {
    var text = 'some text here1231';
    expect(slugify(text)).toBe('some-text-here1231');
  });

  it('should normalize foreign characters to latin characters', function () {
    var text = 'I know latin characters: á í ó ú ç ã õ ñ ü ă ș ț';
    expect(slugify(text)).toBe('i-know-latin-characters-a-i-o-u-c-a-o-n-u-a-s-t');
  });


});
