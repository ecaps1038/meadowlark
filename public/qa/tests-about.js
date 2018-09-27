suite('"About" Page Tests', function(){
test('页面需要有连接到 contact 页面链接', function(){
                     assert($('a[href="/contact"]').length);
               });
});