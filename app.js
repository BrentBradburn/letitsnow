$(document).ready(function() {
    
var num_snow = 120;

var t, ttx; // texture canvas and context
var d, dtx; // dot/cutlines canvas and context
var the_rand;

function updateSnowflakeTexture() {
    $('#snowflakeTexture').attr('src', t.toDataURL()) // update the texture <img> with the current canvas contents
    $('.previewSnowflake').attr('material','src:').attr('material', 'src:#snowflakeTexture'); // remove and replace the material to force a reload of the texture
}

// handle interactive drawing of cutlines and preview toggle
{
let cutlines = 0;
let first_x, first_y;
function isMouseOverFirstPoint(e) { return Math.sqrt( (e.pageX-first_x)*(e.pageX-first_x) + (e.pageY-first_y)*(e.pageY-first_y)) < 15 } // distance between cursor and 'first' point is close enough to consider it a click
$('.wrapper').on('mousemove', function(e) { if ( isMouseOverFirstPoint(e) ) { $('.first').addClass('on') } else { $('.first').removeClass('on') } }) // embiggen the 'first' point indicator when mouse is close to it (suggesting that the user can click to close the path)
$('.wrapper').on('click', function(e) {
    var [t_x, t_y] = [e.pageX - $('#theCanvas').offset().left, e.pageY - $('#theCanvas').offset().top];
    var [o_x, o_y] = [e.pageX - $(this).offset().left, e.pageY - $(this).offset().top];
    if (cutlines == 0) { // create the starting point 'first'
        [first_x, first_y] = [e.pageX, e.pageY];
        ttx.globalCompositeOperation = 'destination-out', ttx.beginPath(), ttx.moveTo(t_x, t_y);
        dtx.globalCompositeOperation = 'source-over', dtx.beginPath(), dtx.moveTo(o_x, o_y);
        cutlines = 1
        $('<div class="first dot" style="left:' + o_x + 'px;top:' + o_y + 'px;"></div>').appendTo($(this)) // draw the 'first' point indicator
    } else if (cutlines > 0) {
        if ( isMouseOverFirstPoint(e) ) { // the first point has been clicked -- close the path and make the cuts
            ttx.closePath(), ttx.fill();
            dtx.closePath(), dtx.clearRect(0, 0, $('#dotCanvas').width(), $('#dotCanvas').height());
            cutlines = 0; // reset the cutlines tracker
            $('.dot').remove()
            updateSnowflakeTexture()
        } else { // add the next cutline
            ttx.lineTo(t_x, t_y);
            dtx.lineTo(o_x, o_y), dtx.stroke();
            cutlines++
            $('<div class="dot" style="left:' + o_x + 'px;top:' + o_y + 'px;"></div>').appendTo($(this)) // draw the new cutline point indicator
        }
    }
})
$('.preview').on('click', function() {
    $('.wrapper').toggleClass('pre')
    $(this).toggleClass('pre')
})
}

function make_one() {
    var ini_x = (Math.random() * 100 - 50);
    var ini_y = (Math.random() * 100 + 100);
    var ini_z = (Math.random() * 100 - 50);
    var t_txt = '<a-entity class="snow" position="' + ini_x + ' ' + ini_y + ' ' + ini_z + '" rotation="0 0 0" obj-model="obj: #snowflake;" scale=".2 .2 .2" material="side:double;transparent:true;src:#snowflakeTexture"'
              + ' animation__position="property: position; to: ' + ini_x + ' ' + (Math.random() * 40 - 200) + ' ' + ini_z + '; dur: ' + (Math.random() * 20000 + 15000) + '; easing: linear; loop: false"'
              + ' animation__rotation="property: rotation; to: ' + (Math.random() * 30) + ' ' + (Math.random() * 360) + ' 0; dur: ' + (Math.random() * 20000 + 15000) + '; easing: linear; loop: false">'
              + '</a-entity>';
    $('a-scene').append($(t_txt));
}

function maintain() {
    if ($('a-entity.snow').length < num_snow) {
        make_one()
    } else if ($('a-entity.snow').eq(0).attr('position').y < -100) {
        $('a-entity.snow').eq(0).remove()
    }
}

function snow() {
    the_rand = setInterval(function() {
        maintain()
    }, 300)
}

$('.start').on('click', function() {
    if ($('body').hasClass('snowing')) { // switch to crafting mode
        clearInterval(the_rand)
        $('a-entity.snow').remove()
        $('body').removeClass('snowing')
        $('.previewSnowflake').attr('visible','true')
        $('#myCam').removeAttr('look-controls')
        $('#myCam').attr('rotation', '0 0 0')
        scene = document.querySelector('a-scene');
        scene.exitVR();
    } else { // switch to snowing mode
        $('body').addClass('snowing')
        $('.previewSnowflake').attr('visible','false')
        snow()
        $('#myCam').attr('look-controls', '')
    }
})

function initialize() {

    // Note: The snowflake asset is not equivalent to a 2D dodecagon -- it's not possible to flatten it into a 2D shape.
    // This may explain why the original code used an aspect of 17/31 instead of 4-2*sqrt(3) -- and the angle (in CSS) is slightly more than 15 degrees.
    // Based on an assumption of exactly 15.0 degrees, my triangles wouldn't line up perfectly with the snowflake asset //!!bmb-whoops!

    //let aspect = 17/31 // the original aspect ratio -- not sure if it's correct given the 3D shape of the snowflake asset
    let aspect = 4-2*Math.sqrt(3) // the aspect ratio of the folded paper (based on 12 identical equilateral triangles that unfold to form a dodecagon)
    let scale = 0.7 // percentage of the screen height to display the folded paper (roughly) //!!bmb-there's some broken interaction with the 'cover' divs when this is close to 1

    let [wx, wy] = [$('.wrapper').width(), $('.wrapper').height()]
    //let [wx, wy] = [window.innerWidth, window.innerHeight]; // use the window size instead of the wrapper size (why not?)
    $('#theCanvas')[0].width = wy *2 * scale * aspect
    $('#theCanvas')[0].height = wy *2 * scale 

    $('#dotCanvas').attr('width',  wx*2 );
    $('#dotCanvas').attr('height', wy*2 );

    // initialize texture canvas 'theCanvas'
    t = document.getElementById("theCanvas");
    [t.style.width,t.style.height] = [t.width / 2 + 'px',t.height / 2 + 'px']
    t.getContext('2d').scale(2, 2)
    ttx = t.getContext("2d");
    ttx.fillStyle = "rgba(255,255,255,1)";
    ttx.fillRect(0, 0, $('#theCanvas').width(), $('#theCanvas').height())

    $('.cover.right').css('top', ($('#theCanvas').offset().top - $('.wrapper').offset().top) + 'px')
    $('.cover.left').css('top', ($('#theCanvas').offset().top - $('.wrapper').offset().top) + 'px')

    $('.cover.right').css('left', (($('.wrapper').width() - $('#theCanvas').width()) / 2 + $('#theCanvas').width()) + 'px')
    $('.cover.left').css('right', (($('.wrapper').width() - $('#theCanvas').width()) / 2 + $('#theCanvas').width()) + 'px')

    // initialize dot/cutlines canvas 'dotCanvas'
    d = document.getElementById("dotCanvas");
    d.style.width = d.width / 2 + 'px'
    d.style.height = d.height / 2 + 'px'
    d.getContext('2d').scale(2, 2)
    dtx = d.getContext("2d");
    dtx.fillStyle = "rgba(255,0,0,1)";
    dtx.strokeStyle = '#666';
    dtx.setLineDash([2, 4]);
    dtx.lineWidth = 1;

}

$(window).on('load resize', function() { initialize() })

});
