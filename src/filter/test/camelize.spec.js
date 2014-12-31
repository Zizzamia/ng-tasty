'use strict';

describe('Filter: camelize', function () {

  beforeEach(module('ngTasty.filter.camelize'));

  var camelize;
  beforeEach(inject(function($filter) {
	  camelize = $filter('camelize');
  }));

  it('has a filterCamelize filter', function () {
    expect(camelize).not.toBeNull();
  });

  it('should return camelized strings', function () {
	expect(camelize('test')).toBe('test');
    expect(camelize('test_string')).toBe('testString');
    expect(camelize('test-string')).toBe('testString');  
    expect(camelize('test_long_string')).toBe('testLongString');  
    expect(camelize('test-long-string')).toBe('testLongString');      
  });
  
  it('should return totally camelized strings with a first=true parameter', function () {
	expect(camelize('test', true)).toBe('Test');
    expect(camelize('test_string', true)).toBe('TestString');
    expect(camelize('test-string', true)).toBe('TestString');  
    expect(camelize('test_long_string', true)).toBe('TestLongString');  
    expect(camelize('test-long-string', true)).toBe('TestLongString');      
  });
  
  it('should not camelize trailing underscores', function () {
	  expect(camelize('_test_string')).toBe('_testString');
	  expect(camelize('_test_long_string')).toBe('_testLongString');
	  expect(camelize('test_string_')).toBe('testString_');
	  expect(camelize('test_long_string_')).toBe('testLongString_');
  });
  
    
  it('should return empty strings for empty/weird inputs', function () {
	expect(camelize('')).toBe('');
    expect(camelize(null)).toBe('');
    expect(camelize(undefined)).toBe('');
    expect(camelize()).toBe('');
    expect(camelize(NaN)).toBe('');
    expect(camelize(beforeEach)).toBe('');
  });
  
  it('should stringify non-string values', function () {
	expect(camelize(0)).toBe('0');
    expect(camelize(1)).toBe('1');
    expect(camelize(-1)).toBe('-1');
    expect(camelize(Infinity)).toBe('Infinity'); 
    expect(camelize(-Infinity)).toBe('-Infinity'); 
    expect(camelize(true)).toBe('true'); 
    expect(camelize(false)).toBe('false'); 
  });

});