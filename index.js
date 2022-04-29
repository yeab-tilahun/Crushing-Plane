$(function () {
    //saving HTML divs and tags to JS varialbles
    var container = $('#container');
    var plane = $('#plane');
    var planeArea=$('#planeArea');
    var building = $('.building');
    var building1 = $("#building1");
    var building2 = $('#building2');
    var highscore_display = $('#highestScore');
    var score = $('#score');
    var gameOverPanel=$('#gameOverPanel');
    var restart = $('#restart');
  
    var container_width = parseInt(container.width());
    var container_height = parseInt(container.height());
    var building_initial_pos = parseInt(building.css('right'));
    var building_initial_height = parseInt(building.css('height'));
    var plane_left = parseInt(plane.css('left'));
    var plane_height = parseInt(plane.height());
  
    
    //initializing some important variables
    var speed = 10; // 10 px/sec
    var go_up_pressed=false; 
    var go_down_pressed=false;
    var go_forward=false;
    var go_backward=false;
    var scoreCurrent=0;   // when game starts, score value is zero
    var updateSpeedInterval=0; //if this value is 2(meaning to buildings have passed), then it will update the speed

    //display highscore
    var key = 'score';
    var data=JSON.parse(localStorage.getItem(key))
    if(data!=null){
       highscore_display.text(data.fname)  
    }

    //this function runs every 20 mililseconds
    var start_game = setInterval(function () {
      //if statments that checks if plane overlap/collide with the buildings, if it collides, game is over
      if(CollisionDetector(planeArea, building1) ||  CollisionDetector(planeArea, building2)){
               gameOver();  //ends the game if there is a collision
      }
  
      var building_curr_pos = parseInt(building.css('right'));
  
          //check if building went out of container,if they are? they loop back again
          if(building_curr_pos > container_width){
  
              //to loop back the buildings
              building_curr_pos=building_initial_pos;
  
              //giving the builidngs new random height for the next loop
                  // random offset value for the buildings height
                  var randomHeight=parseInt((Math.random()*2-1)*80); 
  
                  //changing building heights
                  building1.css('height',building_initial_height + randomHeight);
                  building2.css('height',building_initial_height - randomHeight);
  
                  updateSpeedInterval++; //updating the speed interval;   
                  
                  if(updateSpeedInterval==2){
                      speed=speed+1;//increasing speed by 1 on every iteration/loop
                      updateSpeedInterval=0; //resetting its value    
                  }
                 
                  scoreCurrent=scoreCurrent+1; //updating score by one
                  score.text(scoreCurrent) // showing Score              
          }
          
          building.css('right', building_curr_pos + speed);//increaing speed
  
          MovePlane();    // function that moves the plane Up down left right
          planeReachedBoundariesCheck(); // function that stops the plane form leaving container
          
      }, 20);
  
  
      //38->up arrow 
      //40->down arrow
      //39->right arrow
      //37->left arrow 
     // e.keycodes used to check arrow keys pressed, if the are pressed, the make there boolean value true
     $(document).keydown(function (e) {
          if(e.keyCode==38){
               go_up_pressed=true;
               plane.css('transform',"rotate(-10deg)");
          }else if(e.keyCode==40){
              go_down_pressed=true;
              plane.css('transform',"rotate(+10deg)");
          }
          if(e.keyCode==39){
              go_forward=true;
          }else if(e.keyCode==37){
              go_backward=true;
          }   
      });
  
      // e.keycodes used to check arrow keys released, if the are relased, planes stops moving(all up,down,forward,backwards values become false)
      $(document).keyup(function(e){
          if(e.keyCode==38 || e.keyCode==40 || e.keyCode==39 || e.keyCode==37){ 
              go_down_pressed=false;
              go_up_pressed=false;
              go_forward=false;
              go_backward=false;
              plane.css('transform',"rotate(0deg)");
          }
      });
  
      // function that moves the plane Up down left right
      function MovePlane(){
          if(go_down_pressed){
              plane.css('top',parseInt(plane.css('top'))+25); //if pressed, move plane by 25px
          }else if(go_up_pressed){
              plane.css('top',parseInt(plane.css('top'))-25);
          }
  
          if(go_forward){
              plane.css('left',parseInt(plane.css('left'))+25);
          }else if(go_backward){
              plane.css('left',parseInt(plane.css('left'))-40); 
          }
      }
  
      //function that checks if plane overlap/collide with the buildings, from stackoverflow
      function CollisionDetector($div1, $div2) {
          var x1 = $div1.offset().left;
          var y1 = $div1.offset().top;
          var h1 = $div1.outerHeight(true);
          var w1 = $div1.outerWidth(true);
          var b1 = y1 + h1;
          var r1 = x1 + w1;
          var x2 = $div2.offset().left;
          var y2 = $div2.offset().top;
          var h2 = $div2.outerHeight(true);
          var w2 = $div2.outerWidth(true);
          var b2 = y2 + h2;
          var r2 = x2 + w2;
  
          if (b1 < y2|| y1 > b2 || r1 < x2 || x1 > r2) {
              return false;
          }
          return true;
      }
  
      // function that stops the plane form leaving container
      function planeReachedBoundariesCheck(){
         if(parseInt(plane.css('top'))<0){
           plane.css('top',0);
         }
         if(parseInt(plane.css('top'))>container_height-plane_height){
           plane.css('top',container_height-60);
         }
  
         if(parseInt(plane.css('left'))<50){
          plane.css('left',50);
        }
        if(parseInt(plane.css('left'))>container_width-150){
          plane.css('left',container_width-150);
        }
      }
  
      //game over function to stop the game
      function gameOver(){

        //save the highscore
        var score_=0;
        var user={
            fname:score_
        }

        var key = 'score';
        var data=JSON.parse(localStorage.getItem(key))
        if(data!=null){
            if(data.fname<scoreCurrent){
                window.localStorage.clear()
                data.fname=scoreCurrent
                user.fname=scoreCurrent
                score_=scoreCurrent
                window.localStorage.setItem(key,JSON.stringify(user))
            }  
           highscore_display.text(data.fname) 
        }
        else{
           window.localStorage.setItem(key,JSON.stringify(user))
        }

          gameOverPanel.css('display','block'); //display the game over board
          clearInterval(start_game);  // stop the interval timer method to move the buildings and the plane
      }
  
      //function to reload the page when restart button clicked
      restart.click(function(){
          location.reload(); //reloads the page
      })
  
  });
  
//   window.localStorage.clear()
