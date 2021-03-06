(function() {
    'use strict';

    i18n.init({
        lng: 'en-US',
        customLoad: function(lng, ns, options, loadComplete) {
            loadComplete(null, {
                key: 'key translated',
                key2: 'key2 translated',
                opt_key: 'opt: __opt__',
                nested: {
                    child: 'child translated'
                },
                // Character codes are harder to test, because depending on the platform
                // they may not be escaped when queried via element.html()
                //html: "Symbols &amp; &#8220;Quotes&#8221;"
                html: "Symbols &amp;"
            })
        }
    });

    describe('i18ng directive', function() {
        var $compile;
        var $parentScope;
        var elm;

        beforeEach(angular.mock.module('i18ng'));

        beforeEach(inject(function(_$compile_, $rootScope) {
            $compile = _$compile_;
            $parentScope = $rootScope.$new()
        }));

        afterEach(inject(function(_$compile_, $rootScope) {
            elm = undefined;
            $parentScope = undefined
        }));

        function compileDirective(tpl) {
            if(!tpl) {
                tpl = "<span i18ng=\"'key'\"></span>"
            }
            elm = $compile(tpl)($parentScope);
            $parentScope.$digest()
        }

        it('should initialize', function() {
            compileDirective()
        });

        it('should translate direct strings', function() {
            compileDirective();
            expect(elm.text()).toBe('key translated')
        });

        it('should translate direct strings w/ options', function() {
            compileDirective("<span i18ng=\"'opt_key'\" i18ng-opts=\"{ opt: '1' }\"></span>");
            expect(elm.text()).toBe('opt: 1')
        });

        it('should translate direct strings MISSING options', function() {
            compileDirective("<span i18ng=\"'opt_key'\"></span>");
            expect(elm.text()).toBe('opt: __opt__')
        });

        it('should translate scoped values', function() {
            $parentScope.scopeKey = 'key';
            compileDirective("<span i18ng='scopeKey'></span>");
            expect(elm.text()).toBe('key translated');
        });

        it('should translate scoped value w/ options', function() {
            $parentScope.scopeKey = 'opt_key';
            compileDirective("<span i18ng='scopeKey' i18ng-opts=\"{ opt: '1' }\"></span>");
            expect(elm.text()).toBe('opt: 1');
        });

        it('should translate scoped value w/ scoped options', function() {
            $parentScope.scopeKey = 'opt_key'
            $parentScope.opts = {opt: 1}
            compileDirective("<span i18ng='scopeKey' i18ng-opts='opts'></span>")
            expect(elm.text()).toBe('opt: 1')
        });

        it('should translate and set as html (NO ESCAPING)', function() {
            $parentScope.scopeKey = 'html';
            // Note this uses "i18ng" - only attrib with "g"
            compileDirective("<span i18ng='scopeKey' i18ng-html></span>");
            expect(elm.html()).toBe("Symbols &amp;");
        });

        describe('#attributes', function() {
            it('should translate and set an attribute', function() {
                compileDirective("<span i18ng i18ng-title=\"'key'\"></span>");
                expect(elm.attr('title')).toBe('key translated')
            });

            it('should translate and set an attribute w/opts', function() {
                compileDirective("<span i18ng i18ng-title=\"'opt_key'\" i18ng-title-opts=\"{ opt: 1 }\"></span>");
                expect(elm.attr('title')).toBe('opt: 1');
            });

            it('should translate element and an attribute', function() {
                compileDirective("<span i18ng=\"'key'\" i18ng-title=\"'key2'\"></span>");
                expect(elm.text()).toBe('key translated');
                expect(elm.attr('title')).toBe('key2 translated');
            });

            it('should translate and set two attributes', function() {
                compileDirective("<span i18ng i18ng-title=\"'key'\" i18ng-other=\"'key2'\"></span>");
                expect(elm.attr('title')).toBe('key translated');
                expect(elm.attr('other')).toBe('key2 translated');
            });

            it('should translate and set two attributes w/ opts', function() {
                compileDirective("<span i18ng i18ng-title=\"'opt_key'\" i18ng-title-opts=\"{ opt: 'title' }\"" +
                    " i18ng-other=\"'opt_key'\" i18ng-other-opts=\"{ opt: 'other' }\"></span>");
                expect(elm.attr('title')).toBe('opt: title');
                expect(elm.attr('other')).toBe('opt: other');
            });

            it('should apply opts to the correct attribute', function() {
                compileDirective("<span i18ng i18ng-title=\"'opt_key'\" i18ng-title-opts=\"{ opt: 'title' }\"" +
                    " i18ng-other=\"'opt_key'\"></span>");
                expect(elm.attr('title')).toBe('opt: title');
                expect(elm.attr('other')).toBe('opt: __opt__');
            });
        });
    });

})();
