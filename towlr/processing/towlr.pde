// the processling of towlr
// Author: Andrew Perry (aka 'pansapiens')
// Date: 15-Dec-2008
// License: Simplified BSD ( http://www.opensource.org/licenses/bsd-license.php )
// This game is based on the 'towlr' concept by Micheal Kasprzak.
//
// Copyright (c) 2008, Andrew Perry
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
//
//    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
//    * Neither the name of the <ORGANIZATION> nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

import ddf.minim.*;
Minim minim;
AudioSample blat, plink, touch, down, spacesound;
int bgsoundcounter, plinkspeed;

int LINE;
int MAX_LINE = 4;
int TRIES = 0;
int timetaken = 0;

float[] y = new float[5]; // y coords for each line
float[] boxXY = new float[2];
float[] circleXY = new float[2];
float[] prizeXY = new float[2];
float[] winzone = new float[4];
float[] winzoneXrange = new float[2];
float[] winzoneYrange = new float[2];
float[] deadzone = new float[4];
float[] deadzoneXrange = new float[2];
float[] deadzoneYrange = new float[2];
  
float boxwidth;
float circlewidth;
float prizewidth;
boolean collide_on;
boolean reset_collide;
boolean bg_on;
int y_dir;

boolean DEAD;
boolean WIN;

PImage winning_message;

PFont font;

void setup() 
{
  size(800, 600);  
  frameRate(30);
  smooth();
  strokeWeight(4); // slightly thicker lines
  font = loadFont("NimbusSanL-BoldCond-48.vlw");

  // Set the font and its size (in units of pixels)
  textFont(font, 48);
  
  winning_message = loadImage("oishiikaakidesu.png");
  
  init_level();
  init_sound();
}

void init_level() {
  LINE = 0;
  //LINE = 4; //cheatcode
  TRIES++;
  y[0] = 100; y[1] = 300; y[2] = 500; y[3] = 600; y[4] = 50; // y coords for each line
  boxXY[0] = 150; boxXY[1] = 450;
  circleXY[0] = 650; circleXY[1] = 250;
  prizeXY[0] = 350; prizeXY[1] = 500;
  winzone[0] = 250; winzone[1] = 0; winzone[2] = 200; winzone[3] = 200;
  winzoneXrange[0] = winzone[0]; winzoneXrange[1] = winzone[0]+winzone[2];
  winzoneYrange[0] = winzone[1]; winzoneYrange[1] = winzone[1]+winzone[3];
  deadzone[0] = 250-20; deadzone[1] = 370-20; deadzone[2] = 200+40; deadzone[3] = 270+40;
  deadzoneXrange[0] = deadzone[0]; deadzoneXrange[1] = deadzone[0]+deadzone[2];
  deadzoneYrange[0] = deadzone[1]; deadzoneYrange[1] = deadzone[1]+deadzone[3];

  boxwidth = 60;
  circlewidth = 40;
  prizewidth = 40;
  collide_on = true;
  reset_collide = false;
  bg_on = false;
  y_dir = -3;

  DEAD = false;
  WIN = false;
  
  bgsoundcounter = 0;
  plinkspeed = 85 - (LINE * 20);
}

void init_sound() {
  minim = new Minim(this);
  blat = minim.loadSample("sweepup_high.wav", 2048);
  plink = minim.loadSample("plink.wav", 2048);
  touch = minim.loadSample("noise1.wav", 2048);
  down = minim.loadSample("down.wav", 2048);
  spacesound = minim.loadSample("spacesound.wav", 2048);
}

void keyPressed() {  
  if (key == CODED && !DEAD) {
    if (keyCode == UP) {
        boxXY[1] -= 4;
        circleXY[1] += 4;
      } else if (keyCode == DOWN) {
        boxXY[1] += 4;
        circleXY[1] -= 4;
      } else if (keyCode == LEFT) {
        boxXY[0] += 4;
        circleXY[0] -= 4;
      } else if (keyCode == RIGHT) {
        boxXY[0] -= 4;
        circleXY[0] += 4;
      }
  }
  if (DEAD && (key == ' ' || key == ENTER)) {
    DEAD = false;
    init_level();
  }
  
  boxXY[0] = constrain(boxXY[0], 0, width-boxwidth);
  boxXY[1] = constrain(boxXY[1], 0, height-boxwidth);
  circleXY[0] = constrain(circleXY[0], 0, width-circlewidth);
  circleXY[1] = constrain(circleXY[1], 0, height-circlewidth);
}

boolean within(float v, float[] range) {
  if ( (v > range[0]) && (v < range[1]) || 
       (v > range[1]) && (v < range[0]) ) {
    return true;
  } else {
    return false;
  }
}

void collision_detect() {
  
  float[] boxXrange = {boxXY[0], boxXY[0] + boxwidth};
  float[] boxYrange = {boxXY[1], boxXY[1] + boxwidth};
  float[] circleYrange = {circleXY[1], circleXY[1]+circlewidth};
  float[] prizeYrange = {prizeXY[1], prizeXY[1]+prizewidth/2};
  // left side of "circle" touches box
  if ( within(circleXY[0], boxXrange) &&
       ( within(circleXY[1], boxYrange) || within(circleXY[1]+circlewidth, boxYrange) ) 
     ) {
    
    flash_bg(64, 64, 64);
    
    if (reset_collide) {
      collide_on = true;
      reset_collide = false;
      touch.trigger();
    } else {
      collide_on = false;
    }
    
  } else if
  // right side of "circle" touches box
  ( within(circleXY[0]+circlewidth, boxXrange) &&
       ( within(circleXY[1], boxYrange) || within(circleXY[1]+circlewidth, boxYrange) ) 
     ) {
    
    flash_bg(64, 64, 64);
    
    if (reset_collide) {
      collide_on = true;
      reset_collide = false;
      touch.trigger();
    } else {
      collide_on = false;
    }
    
  } else {
    collide_on = false;
    reset_collide = true;
  }

  // new line upon box/"circle" collision
  if (collide_on) {
    if (!(LINE == 1)) { // all vertical lines (not yellow)
      if (within(y[LINE], boxYrange)) {
          LINE += 1;
          LINE = constrain(LINE, 0, MAX_LINE);
          down.trigger();
      }
    } else if (LINE == 1) { // special case for yellow line
      if (within(y[LINE], boxXrange) && within(y[LINE-1], boxYrange)) {
          LINE += 1;
          LINE = constrain(LINE, 0, MAX_LINE);
          down.trigger();
      }
    }
  }
  
  // yellow line pushes yellow box
  if (LINE >= 1 && within(y[1], boxXrange)) {
    if (y_dir < 0) {
      boxXY[0] = y[1] - boxwidth;
    } else if (y_dir > 0) {
      boxXY[0] = y[1];
    }  
    boxXY[0] = constrain(boxXY[0], 0, width-boxwidth);
  }
  
  // blue line lifts blue "circle"
  if (LINE >= 3 && within(y[3], circleYrange)) {
    circleXY[1] = y[3] - circlewidth;
    circleXY[1] = constrain(circleXY[1], 0, height-circlewidth);
  }
  
  // green line pushes green prize
  if (LINE >= 4 && within(y[4], prizeYrange)) {
    prizeXY[1] = y[4] - (prizewidth/2);
    prizeXY[1] = constrain(prizeXY[1], prizewidth/2, height-(prizewidth/2));
  }
  
  // win when prize is in the win zone
  if ( within(prizeXY[0], winzoneXrange) &&
       within(prizeXY[1], winzoneYrange)) {
         flash_bg(0, 64, 0);
         if (!WIN) {
           spacesound.trigger();
           timetaken = millis()/1000;
         }
         WIN = true;
       }
  // die when box/"circle" is in the dead zone
  // box collision with deadzone
  if ( (within(boxXY[0], deadzoneXrange) &&
        within(boxXY[1]+boxwidth, deadzoneYrange)) ||
       (within(boxXY[0]+boxwidth, deadzoneXrange) &&
        within(boxXY[1]+boxwidth, deadzoneYrange))
        ) {
         flash_bg(64, 0, 0);
         if (!DEAD) { // trigger sound only once
           blat.trigger();
         }
         DEAD = true;
       }
  //"circle" collision with deadzone
  if ( (within(circleXY[0], deadzoneXrange) &&
        within(circleXY[1]+circlewidth, deadzoneYrange)) ||
       (within(circleXY[0]+circlewidth, deadzoneXrange) &&
        within(circleXY[1]+circlewidth, deadzoneYrange))
        ) {
         flash_bg(64, 0, 0);
         if (!DEAD) { // trigger sound only once
           blat.trigger();
         }
         DEAD = true;
       }
}

void flash_bg(float r, float g, float b) {
      if (bg_on) {
      background(0);
      bg_on = false;
    } else {
      background(r, g, b);
      bg_on = true;
    }
}

void draw() 
{ 
  background(255);
  collision_detect();
  
  // win zone
  noStroke();
  fill(235, 255, 235); // inactive cue background
  rect(winzone[0]+50, winzone[1]+winzone[3], winzone[2]-110, winzone[3]+height);
  // active area and border
  fill(0, 128, 0);  
  rect(winzone[0]-20, winzone[1]-20, winzone[2]+40, winzone[3]+40);
  fill(0, 64, 0);
  rect(winzone[0], winzone[1], winzone[2], winzone[3]);
  
  // dead zone
  fill(128, 0, 0);
  rect(deadzone[0], deadzone[1], deadzone[2], deadzone[3]);
  fill(172, 0, 0);
  rect(deadzone[0]+20, deadzone[1]+20, deadzone[2]-40, deadzone[3]-40);
  
  // "LINE1" red
  y[0] = y[0] - 2;
  if (y[0] < 0) { y[0] = height; } 
  stroke(132, 0, 0);
  line(0, y[0], width, y[0]);
  
  // yellow .. actually sweeps along x, not y
  if (LINE >= 1) {
      y[1] = y[1] + y_dir;
      if (y[1] < 0) {
        y_dir = 3;
      }
      if (y[1] > width) {
        y_dir = -3;
      }
      stroke(128, 128, 0);
      //line(0, y[1], width, y[1]);
      line(y[1], 0, y[1], height);
  }
  
  // white
  if (LINE >= 2) {
      y[2] = y[2] - 2;
      if (y[2] < 0) { y[2] = height; } 
      stroke(128, 128, 128);
      line(0, y[2], width, y[2]); // offset by 500
  }
  
  // blue
  if (LINE >= 3) {
      y[3] = y[3] - 3;
      if (y[3] < 0) { y[3] = height; } 
      stroke(0, 0, 172);
      line(0, y[3], width, y[3]); // offset by 600
  }
  
  // green
  if (LINE >= 4) {
      y[4] = y[4] - 4;
      if (y[4] < 0) { y[4] = height; } 
      stroke(0, 172, 0);
      line(0, y[4], width, y[4]); // offset by 50
  }
  
  noStroke();

  // prize
  fill(0, 32, 0);
  ellipse(prizeXY[0], prizeXY[1], prizewidth+10, prizewidth+10); //outer
  fill(0, 128, 0);
  ellipse(prizeXY[0], prizeXY[1], prizewidth, prizewidth); // inner
  
  // circle
  noStroke();
  fill(0,0,255);
  rect(circleXY[0], circleXY[1], circlewidth, circlewidth);
  stroke(0, 32, 128);
  // sidecaps on box
  line(circleXY[0]+1, circleXY[1]+1, circleXY[0]+1, circleXY[1]+circlewidth-1);
  line(circleXY[0]+circlewidth-1, circleXY[1]+1, circleXY[0]+circlewidth-1, circleXY[1]+circlewidth-1);
  noStroke();
  
  // box
  fill(255,255,0);
  rect(boxXY[0], boxXY[1], boxwidth, boxwidth);
  stroke(128, 128, 0);
  // sidecaps on box
  line(boxXY[0]+1, boxXY[1]+1, boxXY[0]+1, boxXY[1]+boxwidth-1);
  line(boxXY[0]+boxwidth-1, boxXY[1]+1, boxXY[0]+boxwidth-1, boxXY[1]+boxwidth-1);
  noStroke();
  
  // cross of towlr
  fill(128);
  rect(412.5,300,5,30);
  rect(400,312.5,30,5);
  
  if (DEAD) {
    fill(172, 0, 0);
    text("You died.", 280, 280);
    text("Press space to restart", 180, 330);
  }
  
  if (WIN && !DEAD) {
    fill(255, 0, 0);
    
    // tries vs. try
    String try_str;
    if (TRIES > 1) {
      try_str = " tries.";
    } else { try_str = " try."; }

    text("Yay ! You won in "+TRIES+try_str, 200, 250);
    text("It took you " + timetaken + " seconds.", 200, 300);
    image(winning_message, 200, 310, winning_message.width, winning_message.height);
  }
  
  bgsoundcounter++;
  if (bgsoundcounter > plinkspeed) {
    plink.trigger();
    bgsoundcounter = 0;
    plinkspeed = 85 - (LINE * 20);
  }
} 

// for sounds
void stop()
{
  blat.close();
  plink.close();
  touch.close();
  down.close();
  spacesound.close();
  minim.stop();
  super.stop();
}
