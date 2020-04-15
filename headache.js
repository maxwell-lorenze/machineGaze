let capture
let tracker
let ball1
let ball2
let bouncing_balls = []



function setup() {

    createCanvas(800, 600).parent('p5')

    // set up video and tracker
    capture = createCapture(VIDEO)
    capture.size(800, 600)
    capture.hide()
    tracker = new clm.tracker()
    tracker.init()
    tracker.start(capture.elt)

    ball1 = {    x: width / 2,
                y: height / 2,
                vx: random(-2, 2),
                vy: random(-2, 2)
            }
    ball2 = { x: width / 2,
                y: height / 2,
                vx: random(-2, 2),
                vy: random(-2, 2)
              }




}

function draw() {
  if(frameCount < 350){
    background(0)

    noFill()
    stroke(255)
    circle(ball1.x, ball1.y, 10)
    ball1.x += ball1.vx
    ball1.y += ball1.vy
    circle(ball2.x, ball2.y, 10)
    ball2.x += ball2.vx
    ball2.y += ball2.vy


    let features = tracker.getCurrentPosition()


    if (features.length == 0) {
        return
    }

    //    'features' is an array of objects with x, y properties
        for (let feature of features) {
             stroke(255)
             fill(random(0,250), random(0,250), random(0,250))
             drawStar(feature.x, feature.y, feature.radius, 3, 5 )
             //text(feature.label, feature.x, feature.y)
         }

    noStroke()

    // make a new array of all the points in the right eye
    let eyeR = [
      features[24],
      features[63],
      features[23],
      features[66],
      features[26],
      features[65],
      features[25],
      features[64]
    ]
    let eyeL =[
          features[28],
          features[70],
          features[31],
          features[69],
          features[30],
          features[68],
          features[29],
          features[67]
    ]

    // use a loop to make a shape vertex from each of those points
    stroke(255)
    noFill()
    beginShape()
    for (let eyeR_point of eyeR) {
        curveVertex(eyeR_point.x, eyeR_point.y)
    }
    endShape(CLOSE)
    stroke(255)
    noFill()
    beginShape()
    for (let eyeL_point of eyeL) {
        curveVertex(eyeL_point.x, eyeL_point.y)
    }
    endShape(CLOSE)

    stroke(255)
    line(features[27].x, features[27].y, ball1.x, ball1.y)
    stroke(255)
    line(features[32].x, features[32].y, ball2.x, ball2.y)

    let eyeR_distance = dist(ball1.x, ball1.y, features[27].x, features[27].y)
    print(eyeR_distance)
    let eyeL_distance = dist(ball2.x, ball2.y, features[32].x, features[32].y)
    print(eyeL_distance)

    if (eyeR_distance > 300) {
        ball1.vx = -ball1.vx
        ball1.vy = -ball1.vy
    }
    if(eyeL_distance > 300) {
      ball2.vx = -ball2.vx
      ball2.vy = -ball2.vy
    }


}
//else if(frameCount < 400){

    // draw background stuff
    //background(0)

    // show the mirrored video feed
    //showFlippedCapture()

    // get new data from tracker
    //let features = tracker.getCurrentPosition()

    // sometimes the tracker doesn't capture anything
    // in that case, we want to stop the function right here using 'return'
    //if (features.length == 0) {
    //    return
    //}

//    'features' is an array of objects with x, y properties
    // for (let feature of features) {
    //     stroke(255)
    //     fill(255)
    //     circle(feature.x, feature.y, 4)
    //     text(feature.label, feature.x, feature.y)
    // }
    //let forehead = features[33]

    //let mind_ball = { x: random(forehead.x - 20, forehead.x + 20),
                        //    y: random(forehead.y - 5, forehead.y + 5),
                        //    vx: random(forehead / 8, forehead / 4),
                        //    vy: random(-10, 10),
                        //    c: [random(255), random(255), random(255)]
                    //   }
      //  bouncing_balls.push(mind_ball)


  //for (let ball of bouncing_balls) {

      //  noStroke()
      //  fill(ball.c)
      //  circle(ball.x, ball.y, ball.size)

    //    ball.x = ball.x +  ball.vx
    //    ball.y = ball.y + ball.vy

    //    ball.vy += 0.8

    //    if (ball.x < 0 || ball.x > width || ball.y < 0 || ball.y > height) {
      //      mind_ball.splice(mind_ball.indexOf(bouncing_balls), 1)
    //    }

    //}
  //}
else{
  background(0)
  showFlippedCapture()
  for (let i=0; i<10; i++) {

              let random_ball = {x: random(0, width),
                                y: random(0, height),
                                size: random(5,50),
                                vx: random(1, i),
                                vy: random(1, i),
                                color: [random(0,255), random(0,255), random(0,255)]
                              }

              bouncing_balls.push(random_ball)
}
  for (let ball of bouncing_balls){


 fill (ball.color)


 circle(ball.x, ball.y, ball.size)
  ball.x = ball.x + ball.vx
  ball.y = ball.y + ball.vy



  // bounce ball off walls
         if (ball.x >= width - ball.size/2) {
             ball.vx = -ball.vx      // flip the direction!
         }
         if (ball.x <= 0 + ball.size/2) {
             ball.vx = -ball.vx
         }
         if (ball.y >= height - ball.size/2) {
             ball.vx = -ball.vx
         }
         if (ball.y <= 0 + ball.size/2) {
             ball.vx = -ball.vx
         }

         // check if it is colliding with another ball
         // we do this by selecting a second ball from our array
         for (let other_ball of bouncing_balls) {
             if (other_ball != ball) {   // this condition stops us from testing if the ball is colliding with itself

                 // how close do they have to be to touch?
                 let touching = abs(ball.size/2 + other_ball.size/2)

                 // how far apart are they now?
                 let distance = dist(ball.x, ball.y, other_ball.x, other_ball.y)

                 // if theyre touching, bounce them
                 // (not real physics, but close enough for now)
                 if (distance <= touching) {
                     ball.vx = -ball.vx
                     ball.vy = -ball.vy
                     ball.x = ball.x + ball.vx
                     ball.y = ball.y + ball.vy
                 }

             }
         }
       }
}
}
function showFlippedCapture() {
    push()
    translate(capture.width, 0)
    scale(-1, 1)
    image(capture, 0, 0, capture.width, capture.height)
    pop()
}
// adapted from https://p5js.org/examples/form-star.html
function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
//balll start from he head
