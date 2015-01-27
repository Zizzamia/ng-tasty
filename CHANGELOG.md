## Changelog

### v0.4.7 (master, released on January 27th 2015)
#### Features
- Add custom template header [#90](https://github.com/Zizzamia/ng-tasty/issues/90)
- Add bind-reload on server side table [#90](https://github.com/Zizzamia/ng-tasty/issues/89)

#### Bug Fixes
- Fixed bug with bind-init [#91](https://github.com/Zizzamia/ng-tasty/issues/91)


### v0.4.6 (released on January 22th 2015)
#### Bug Fixes
- Fixed bug passing plain text without bind [#87](https://github.com/Zizzamia/ng-tasty/issues/87)


### v0.4.5 (released on January 19th 2015)
#### Features
- Add option to have different $watch resource version [#80](https://github.com/Zizzamia/ng-tasty/issues/80)
- Add slugify filter [#78](https://github.com/Zizzamia/ng-tasty/issues/78)
- Add camelize filter [#77](https://github.com/Zizzamia/ng-tasty/issues/77)


### v0.4.4 (released on December 27th 2014)
#### Features
- Implement Throttle service [#74](https://github.com/Zizzamia/ng-tasty/issues/74)
- Now it's possible select bootstrap icon by the tableConfig [#73](https://github.com/Zizzamia/ng-tasty/issues/73)


### v0.4.3 (released on December 25th 2014)
#### Features
- Now by adding a value in resource you can also use it in the table scope [#69](https://github.com/Zizzamia/ng-tasty/issues/69)


### v0.4.2 (released on December 22th 2014)
#### Bug Fixes
- Fixed pagination issue during filtering [#65](https://github.com/Zizzamia/ng-tasty/issues/65)
- Fixed bug when header is an empty list [#66](https://github.com/Zizzamia/ng-tasty/issues/66)
- Fixed bug when using the $scope.params outside the table [#67](https://github.com/Zizzamia/ng-tasty/issues/67)
- Fixed pagination if resource.pagination is missing [#68](https://github.com/Zizzamia/ng-tasty/issues/68)


### v0.4.1 (released on December 10th 2014)
#### Bug Fixes
- Fixed bad list module name in dist folder [#63](https://github.com/Zizzamia/ng-tasty/issues/63)


### v0.4.0 (released on December 8th 2014)
#### Features
- Added support for templateUrl scope in pagination directive [#61](https://github.com/Zizzamia/ng-tasty/issues/61)

#### Breaking Changes
- All the architecture now is devide in three main part: component, service, filter. The goal is to
  give all the tools for start your own tasty collection by using ngTasty as scaffold.
- For the new ngTasty v0.4.0 I'm getting inspiration from the Straw-man Proposal, all the table 
  directive API is more flexible. If you add `bind-` before means you passing a `$scope` variable
  otherwise you pass a classic value.


### v0.3.3 (released on November 28th 2014)
#### Bug Fixes
- Fixed pagination links conflicts with routing [#50](https://github.com/Zizzamia/ng-tasty/issues/50)

#### Features
- Optional template for pagination [#57](https://github.com/Zizzamia/ng-tasty/issues/57)

#### Breaking Changes
- tasty-thead stop set width columns as default [#56](https://github.com/Zizzamia/ng-tasty/issues/56)


### v0.3.2 (released on November 22th 2014)
#### Bug Fixes
- Fixed server side default sortBy and sortOrder #51 [#51](https://github.com/Zizzamia/ng-tasty/issues/51)

#### Features
- Improvemed not-sort-by [#47](https://github.com/Zizzamia/ng-tasty/issues/47)
- Implemented custom th width  [#19](https://github.com/Zizzamia/ng-tasty/issues/19)


### v0.3.1 (released on November 10th 2014)
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
