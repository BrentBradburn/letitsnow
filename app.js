$(document).ready(function() {
    
var num_snow = 120;

var t;
var d;
var ttx;
var dtx;
var pre_x;
var pre_y;
var the_rand;

function apply_img() {
    var dataUrl = t.toDataURL();
    $('a-assets > img').attr('src', dataUrl)
    //$('.sample').remove();
    var t_txt = '<a-entity class="sample" obj-model="obj: #snowflake;" scale=".2 .2 .2" position="0 0.3 -5" rotation="45 0 0" material="src:#the_tile;transparent:true;side:double" animation="property: rotation; to: 45 360 0; dur: 10000; easing: linear; loop: true"></a-entity>';
    $('.container').append($(t_txt));
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
            apply_img()
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
    var t_txt = '<a-entity class="snow" position="' + ini_x + ' ' + ini_y + ' ' + ini_z + '" rotation="0 0 0" obj-model="obj: #snowflake;" scale=".2 .2 .2" material="side:double;transparent:true;src:#the_tile" animation__position="property: position; to: ' + ini_x + ' ' + (Math.random() * 40 - 200) + ' ' + ini_z + '; dur: ' + (Math.random() * 20000 + 15000) + '; easing: linear; loop: false" animation__rotation="property: rotation; to: ' + (Math.random() * 30) + ' ' + (Math.random() * 360) + ' 0; dur: ' + (Math.random() * 20000 + 15000) + '; easing: linear; loop: false"></a-entity>';
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
    if ($('body').hasClass('snowing')) {
        clearInterval(the_rand)
        $('a-entity.snow').remove()
        $('body').removeClass('snowing')
        var t_txt = '<a-entity class="sample" obj-model="obj: #snowflake;" scale=".2 .2 .2" position="0 0.3 -5" rotation="45 0 0" material="src:#the_tile;transparent:true;side:double" animation="property: rotation; to: 45 360 0; dur: 10000; easing: linear; loop: true"></a-entity>';
        $('.container').append($(t_txt));
        $('#myCam').removeAttr('look-controls')
        $('#myCam').attr('rotation', '0 0 0')
        scene = document.querySelector('a-scene');
        scene.exitVR();
    } else {
        $('body').addClass('snowing')
        apply_img()
        snow()
        $('.sample').remove();
        $('#myCam').attr('look-controls', '')
    }
})

function initialize() {

    // scale the folded paper
    let scale = 0.7 // percentage of the "wrapper" (div) height to use for the folded paper
    let aspect = 4-2*Math.sqrt(3) // the aspect ratio of the folded paper (based on 12 identical equilateral triangles that unfold to form a dodecagon)
    let [wx, wy] = [$('.wrapper').width(), $('.wrapper').height()]
    //let [wx, wy] = [window.innerWidth, window.innerHeight];
    $('#theCanvas')[0].width = wy *2 * scale * aspect
    $('#theCanvas')[0].height = wy *2 * scale 

    $('#dotCanvas').attr('width',  $('.wrapper').width() *2 );
    $('#dotCanvas').attr('height', $('.wrapper').height()*2 );

    // theCanvas
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

    // dotCanvas
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

//initialize()

});
