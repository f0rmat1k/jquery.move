$(function(){
    $('.testBlock_1 .testCube').click(function(){
        $(this).move({ top: '100px', left: 250 }, 2000);
    });

    $('.testBlock_2 .testCube').click(function(){
        $(this).move({ top: '100px', left: 250 }, 2000);
    });

    $('.testBlock_3 .testCube').click(function(){
        $(this).move({ top: '+=20px', left: '+=30' }, 500);
    });

    $('.testBlock_4 .testCube').click(function(){
        $(this).move({ top: '-=20px', left: '-=30' }, 500);
    });

    $('.testBlock_5 .testCube').click(function(){
        $(this).move({ top: '30%', left: '50%' }, 500);
    });

});