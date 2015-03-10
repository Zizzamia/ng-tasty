describe('Filter: filterInt', function () {

  beforeEach(module('ngTasty.filter.filterInt'));

  var filterInt;
  beforeEach(inject(function($filter) {
    filterInt = $filter('filterInt');
  }));

  it('has a filterInt filter', function () {
    expect(filterInt).not.toBeNull();
  });

  it('should return an integer when passing a number value', function () {
    expect(filterInt(10)).toBe(10);
    expect(filterInt('10')).toBe(10);
  });

  it('should return NaN when passing a not number value', function () {
    expect(filterInt('Not a number')).toBeNaN();
  });

});
