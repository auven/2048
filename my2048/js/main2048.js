/**
 * Created by meangel on 16-12-4.
 */
var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function () {
    prepareForMobile();
   newgame();
});

function prepareForMobile() {

    if(documentWidth>500)
    {
        gridContainerWidth = 500;
        cellSideLength = 100;
        cellSpace = 20;
    }

    $("#grid-container").css('width',gridContainerWidth - 2*cellSpace+'px');
    $("#grid-container").css('height',gridContainerWidth - 2*cellSpace+'px');
    $("#grid-container").css('padding',cellSpace+'px');
    $("#grid-container").css('border-radius',0.02*gridContainerWidth+'px');

    $('.grid-cell').css('width',cellSideLength+'px');
    $('.grid-cell').css('height',cellSideLength+'px');
    $('.grid-cell').css('border-radius',0.02*cellSideLength+'px');
}

function newgame() {
    //初始化棋盘格
    init();
    //在随机两个各自生成数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for( var i = 0 ; i < 4 ; i++)
    {
        for(var j=0; j<4; j++)
        {
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css('top', getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
        }
    }

    for(var i = 0; i < 4 ; i ++){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for(var j = 0 ; j < 4 ; j ++){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();

    score = 0;
}

function updateBoardView() {
    $(".number-cell").remove();
    for(var i = 0; i < 4; i ++){
        for(var j = 0; j < 4; j ++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if(board[i][j] == 0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2);
                theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2);
            } else{
                theNumberCell.css('width',cellSideLength+'px');
                theNumberCell.css('height',cellSideLength+'px');
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );
                theNumberCell.css('color',getNumberColor( board[i][j] ) );
                theNumberCell.text( board[i][j] );
            }

            if(board[i][j] < 128){
                theNumberCell.css('font-size',0.6*cellSideLength+'px');
            } else if(board[i][j] < 1024){
                theNumberCell.css('font-size',0.5*cellSideLength+'px');
            } else{
                theNumberCell.css('font-size',0.4*cellSideLength+'px');
            }


            hasConflicted[i][j] =false;
        }
    }

    $('.number-cell').css('line-height',cellSideLength+'px');

}

function generateOneNumber() {
    if( nospace(board))
        return false;

    //随机一个数字
    var randx = parseInt( Math.floor( Math.random() * 4 ) );
    var randy = parseInt( Math.floor( Math.random() * 4 ) );

    var times=0;
    while ( times < 50) {
        if(board[randx][randy] == 0)
            break;

        randx = parseInt( Math.floor( Math.random() * 4 ) );
        randy = parseInt( Math.floor( Math.random() * 4 ) );

        times++;
    }
    if(times == 50){
        for(var i=0;i<4;i++)
            for(var j=0;j=4;j++)
                if(board[i][j] == 0){
                    randx = i;
                    randy = j;
                }
    }

    //随机一个位置
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation( randx , randy , randNumber);

    return true;
}

$(document).keydown(function (event) {
    // event.preventDefault();
   switch (event.keyCode){
       case 37:  //向左
           event.preventDefault();
           if(moveLeft()) {
               setTimeout("generateOneNumber()", 210);  //与动画效果同步
               setTimeout("isgameover()",300);
           }
           break;
       case 38:  //向上
           event.preventDefault();
           if(moveUp()){
               setTimeout("generateOneNumber()", 210);  //与动画效果同步
               setTimeout("isgameover()",300);
           }
           break;
       case 39:  //向右
           event.preventDefault();
           if(moveRight()){
               setTimeout("generateOneNumber()", 210);  //与动画效果同步
               setTimeout("isgameover()",300);
           }
           break;
       case 40:  //向下
           event.preventDefault();
           if(moveDown()){
               setTimeout("generateOneNumber()", 210);  //与动画效果同步
               setTimeout("isgameover()",300);
           }
           break;
       default:
           break;
   }
});


document.addEventListener('touchstart',function (event) {
   startx=event.touches[0].pageX;
   starty=event.touches[0].pageY;
});

document.addEventListener('touchmove',function (event) {
    event.preventDefault();
});

document.addEventListener('touchend',function (event) {
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;

    if(Math.abs(deltax) <0.3*documentWidth && Math.abs(deltay)<0.3*documentWidth)
        return;
    //x
    if(Math.abs(deltax)>=Math.abs(deltay)){
        if(deltax>0){
            //向右滑动
            if(moveRight()){
                setTimeout("generateOneNumber()", 210);  //与动画效果同步
                setTimeout("isgameover()",300);
            }
        } else{
            //向左
            if(moveLeft()) {
                setTimeout("generateOneNumber()", 210);  //与动画效果同步
                setTimeout("isgameover()",300);
            }
        }
    }
    //y
    else {
        if(deltay>0){
            //向下
            if(moveDown()){
                setTimeout("generateOneNumber()", 210);  //与动画效果同步
                setTimeout("isgameover()",300);
            }
        } else {
            //向上
            if(moveUp()){
                setTimeout("generateOneNumber()", 210);  //与动画效果同步
                setTimeout("isgameover()",300);
            }
        }
    }
});


function isgameover() {
    if(nospace(board) && nomove( board ))
        gameover();
}

function gameover() {
    alert("游戏结束！");
}

function moveLeft() {
    if( !canMoveLeft( board ))
        return false;

    //moveLeft
    for(var i = 0 ; i < 4 ; i ++)
        for( var j = 1 ; j < 4 ;j ++){
            if(board[i][j] != 0){
                for(var k = 0;k<j;k++){
                    if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                    else if(board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;

                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200); //与动画效果同步
    return true;
}

function moveUp() {
    if( !canMoveUp( board ))
        return false;

    //moveUp
    for(var i = 1 ; i < 4 ; i ++)
        for( var j = 0 ; j < 4 ;j ++){
            if(board[i][j] != 0){
                for(var k = 0; k<i; k++){
                    if(board[k][j] == 0 && noBlockVertical(k,i,j,board)){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                    else if(board[k][j] == board[i][j] && noBlockVertical(k,i,j,board) && !hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        score +=board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;

                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight() {
    if( !canMoveRight( board ))
        return false;

    //moveRight
    for(var i = 0 ; i < 4 ; i ++)
        for( var j = 2 ; j >= 0 ;j --){
            if(board[i][j] != 0){
                for(var k = 3; k>j; k--){
                    if(board[i][k] == 0 && noBlockHorizontal(i,j,k,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                    else if(board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;

                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown() {
    if( !canMoveDown( board ))
        return false;

    //moveDown
    for(var i = 2 ; i >= 0 ; i --)
        for( var j = 0 ; j < 4 ;j ++){
            if(board[i][j] != 0){
                for(var k = 3; k>i; k--){
                    if(board[k][j] == 0 && noBlockVertical(i,k,j,board)){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                    else if(board[k][j] == board[i][j] && noBlockVertical(i,k,j,board) && !hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;

                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

// function moveUp() {
//     if( !canMoveUp( board ))
//         return false;
//
//     for(var j=0;j<4;j++)
//         for(var i=1;i<4;i++) {
//             if (board[i][j] != 0) {
//                 for (var k = 0; k < i; i++) {
//                     if (board[k][j] == 0 && noBlockVertical(k, i, j, board)) {
//                         //move
//                         showMoveAnimation(i, j, k, j);
//                         //add
//                         board[k][j] = board[i][j];
//                         board[i][j] = 0;
//                         continue;
//                     } else if (board[k][j] == board[i][j] && noBlockVertical(k, i, j, board)) {
//                         //move
//                         showMoveAnimation(i, j, k, j);
//                         //add
//                         board[k][j] += board[i][j];
//                         board[i][j] = 0;
//                         continue;
//                     }
//                 }
//                 continue;
//             }
//         }
//
//     setTimeout("updateBoardView()",200);
//     return true;
//
// }


//
// function moveUp() {
//     if( !canMoveUp( board ))
//         return false;
//
//     //moveUp
//     for(var i = 1 ; i < 4 ; i ++)
//         for( var j = 0 ; j < 4 ;j ++){
//             if(board[i][j] != 0){
//                 for(var k = 0;k<i;k++){
//                     if(board[k][j] == 0 && noBlockUp(k,i,j,board)){
//                         //move
//                         showMoveAnimation(i,j,k,j);
//                         //add
//                         board[k][j] = board[i][j];
//                         board[i][j] = 0;
//
//                         continue;
//                     }
//                     else if(board[k][j] == board[i][j] && noBlockUp(k,i,j,board)){
//                         //move
//                         showMoveAnimation(i,j,k,j);
//                         //add
//                         board[k][j] += board[i][j];
//                         board[i][j] = 0;
//
//                         continue;
//                     }
//                 }
//             }
//         }
//
//     setTimeout("updateBoardView()",200);
//     return true;
// }
//
// function moveRight() {
//     if( !canMoveRight( board ))
//         return false;
//
//     //moveRight
//     for(var i = 0 ; i < 4 ; i ++)
//         for( var j = 2 ; j > -1 ;j ++){
//             if(board[i][j] != 0){
//                 for(var k = 3;k > j; k--){
//                     if(board[i][k] == 0 && noBlockRight(i,k,j,board)){
//                         //move
//                         showMoveAnimation(i,j,i,k);
//                         //add
//                         board[i][k] = board[i][j];
//                         board[i][j] = 0;
//
//                         continue;
//                     }
//                     else if(board[i][k] == board[i][j] && noBlockRight(i,k,j,board)){
//                         //move
//                         showMoveAnimation(i,j,i,k);
//                         //add
//                         board[i][k] += board[i][j];
//                         board[i][j] = 0;
//
//                         continue;
//                     }
//                 }
//             }
//         }
//
//     setTimeout("updateBoardView()",200);
//     return true;
// }
//
// function moveDown() {
//     if( !canMoveDown( board ))
//         return false;
//
//     //moveDown
//     for(var i = 2 ; i > -1 ; i --)
//         for( var j = 0 ; j < 4 ;j ++){
//             if(board[i][j] != 0){
//                 for(var k = 3;k>i;k--){
//                     if(board[k][j] == 0 && noBlockDown(k,i,j,board)){
//                         //move
//                         showMoveAnimation(i,j,k,j);
//                         //add
//                         board[k][j] = board[i][j];
//                         board[i][j] = 0;
//
//                         continue;
//                     }
//                     else if(board[k][j] == board[i][j] && noBlockDown(k,i,j,board)){
//                         //move
//                         showMoveAnimation(i,j,k,j);
//                         //add
//                         board[k][j] += board[i][j];
//                         board[i][j] = 0;
//
//                         continue;
//                     }
//                 }
//             }
//         }
//
//     setTimeout("updateBoardView()",200);
//     return true;
// }

