var num_snow = 120;

var t;
var d;
var ttx;
var dtx;
var st_x;
var st_y;
var pre_x;
var pre_y;
var the_rand;

function make_one() {
    var ini_x = (Math.random() * 100 - 50);
    var ini_y = (Math.random() * 100 + 100);
    var ini_z = (Math.random() * 100 - 50);
    var t_txt = '<a-entity class="snow" position="' + ini_x + ' ' + ini_y + ' ' + ini_z + '" rotation="0 0 0" obj-model="obj: #snowflake;" scale=".2 .2 .2" material="side:double;transparent:true;src:#the_tile" animation__position="property: position; to: ' + ini_x + ' ' + (Math.random() * 40 - 200) + ' ' + ini_z + '; dur: ' + (Math.random() * 20000 + 15000) + '; easing: linear; loop: false" animation__rotation="property: rotation; to: ' + (Math.random() * 30) + ' ' + (Math.random() * 360) + ' 0; dur: ' + (Math.random() * 20000 + 15000) + '; easing: linear; loop: false"></a-entity>';
    $(t_txt).appendTo($('a-scene'))
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
        $(t_txt).appendTo($('.container'))
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

var is_drawing = 0;
$('.wrapper').on('click', function(e) {
    var t_x = e.pageX - $('#theCanvas').offset().left;
    var t_y = e.pageY - $('#theCanvas').offset().top;
    var o_x = e.pageX - $(this).offset().left
    var o_y = e.pageY - $(this).offset().top

    if (is_drawing == 0) {
        st_x = e.pageX
        st_y = e.pageY
        ttx.globalCompositeOperation = 'destination-out'
        dtx.globalCompositeOperation = 'source-over'
        ttx.beginPath();
        dtx.beginPath();
        ttx.moveTo(t_x, t_y);
        dtx.moveTo(o_x, o_y);
        is_drawing = 1
        $('<div class="first dot" style="left:' + o_x + 'px;top:' + o_y + 'px;"></div>').appendTo($(this))
    } else if (is_drawing > 0) {
        var dist = Math.sqrt((e.pageX - st_x) * (e.pageX - st_x) + (e.pageY - st_y) * (e.pageY - st_y))
        if (dist < 15) {
            ttx.closePath();
            ttx.fill();
            dtx.closePath();
            dtx.clearRect(0, 0, $('#dotCanvas').width(), $('#dotCanvas').height());
            is_drawing = 0;
            $('.dot').remove()
            apply_img()
        } else {
            ttx.lineTo(t_x, t_y);
            dtx.lineTo(o_x, o_y);
            dtx.stroke();
            is_drawing++
            $('<div class="dot" style="left:' + o_x + 'px;top:' + o_y + 'px;"></div>').appendTo($(this))
        }

    }
})
$('.wrapper').on('mousemove', function(e) {
    var dist = Math.sqrt((e.pageX - st_x) * (e.pageX - st_x) + (e.pageY - st_y) * (e.pageY - st_y))
    if (dist < 15) {
        $('.first').addClass('on')
    } else {
        $('.first').removeClass('on')
    }
})

function apply_img() {
    var dataUrl = t.toDataURL();
    $('a-assets > img').attr('src', dataUrl)
    $('.sample').remove();
    var t_txt = '<a-entity class="sample" obj-model="obj: #snowflake;" scale=".2 .2 .2" position="0 0.3 -5" rotation="45 0 0" material="src:#the_tile;transparent:true;side:double" animation="property: rotation; to: 45 360 0; dur: 10000; easing: linear; loop: true"></a-entity>';
    $(t_txt).appendTo($('.container'))
}

$('.preview').on('click', function() {
    $('.wrapper').toggleClass('pre')
    $(this).toggleClass('pre')
})

function paper() {
    $('#theCanvas').attr('height', $('.wrapper').height() * 0.7 * 2);
    $('#theCanvas').attr('width', $('.wrapper').height() * 0.7 * 0.54838709677 * 2)
    $('#dotCanvas').attr('width', $('.wrapper').width() * 2);
    $('#dotCanvas').attr('height', $('.wrapper').height() * 2);
    t = document.getElementById("theCanvas");
    t.style.width = t.width / 2 + 'px'
    t.style.height = t.height / 2 + 'px'
    t.getContext('2d').scale(2, 2)
    ttx = t.getContext("2d");
    ttx.fillStyle = "rgba(255,255,255,1)";
    ttx.fillRect(0, 0, $('#theCanvas').width(), $('#theCanvas').height())
    $('.cover.right').css('top', ($('#theCanvas').offset().top - $('.wrapper').offset().top) + 'px')
    $('.cover.left').css('top', ($('#theCanvas').offset().top - $('.wrapper').offset().top) + 'px')
    $('.cover.right').css('left', (($('.wrapper').width() - $('#theCanvas').width()) / 2 + $('#theCanvas').width()) + 'px')
    $('.cover.left').css('right', (($('.wrapper').width() - $('#theCanvas').width()) / 2 + $('#theCanvas').width()) + 'px')
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

$(document).ready(function() {
    paper()
});
