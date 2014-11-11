## Changelog

### v0.3.1 (master, released on November 10th 2014)
#### Bug Fixes
- Improved filter in server side table [#44](https://github.com/Zizzamia/ng-tasty/issues/44)
- Pagination now is following the Bootstrap standard [#43](https://github.com/Zizzamia/ng-tasty/issues/43)
- Fixed setPaginationRanges where the number of rows are bigger than the pagination range [#42](https://github.com/Zizzamia/ng-tasty/issues/42)

#### Features
- Query config params and init params [#3](https://github.com/Zizzamia/ng-tasty/issues/3)

### v0.3.0 (released on October 22th 2014)
#### Bug Fixes
- Fixed possible issue when header key are not lowercase [#35](https://github.com/Zizzamia/ng-tasty/issues/35)

#### Features
- Implemented a [feature request], simplified header for resources [#37](https://github.com/Zizzamia/ng-tasty/issues/37)
- Implemented the filter functionality in the table directive [#33](https://github.com/Zizzamia/ng-tasty/issues/33)

#### Breaking Changes
- Refactoring to be ready for Angular 1.3 [#34](https://github.com/Zizzamia/ng-tasty/issues/34)

### v0.2.7 (released on September 8th 2014)
- Improved Performance more than 110%!!! [#28](https://github.com/Zizzamia/ng-tasty/issues/28)
- Fixed pagination issue when there is only one row [#30](https://github.com/Zizzamia/ng-tasty/issues/30)
- Added params object as response in the sorting/pagination server side table callback. [#31](https://github.com/Zizzamia/ng-tasty/issues/31)
- Improved message errors [#32](https://github.com/Zizzamia/ng-tasty/issues/32)[#29](https://github.com/Zizzamia/ng-tasty/issues/29)

### v0.2.6 (released on August 26th 2014)
- Improved sorting by key [#27](https://github.com/Zizzamia/ng-tasty/issues/27)
- Fixed issue about refresh external scope variable [#25](https://github.com/Zizzamia/ng-tasty/issues/25)
- Initial Benchmarks by using Benchpress [#26](https://github.com/Zizzamia/ng-tasty/issues/26)

### v0.2.5 (released on August 21th 2014)
- Added items-per-page and list-items-per-page settings in table pagination [#15](https://github.com/Zizzamia/ng-tasty/issues/15)
- Added ngTasty.service.tastyUtil [#24](https://github.com/Zizzamia/ng-tasty/issues/24)
- Removed all the Grunt dependence [#23](https://github.com/Zizzamia/ng-tasty/issues/23)
- Fixed table pagination responsive [#18](https://github.com/Zizzamia/ng-tasty/issues/18)

### v0.2.4 (released on August 13th 2014)
- Added a new table that has sorting and pagination client side
- Improved `setDirectivesValues` in `ngTasty.table`
- Fixed issues in `ngTasty.filter.range`
- Fixed issue in `ngTasty.service.setProperty`