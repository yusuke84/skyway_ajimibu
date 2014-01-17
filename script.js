/**
 * Created by yusuke on 2013/12/20.
 */

//APIキー
var APIKEY = '5787557a-7f38-11e3-b7a2-2f2b5bb56f4d';

//ユーザーリスト
var userList = [];

//Callオブジェクト
var existingCall;

// Compatibility
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// PeerJSオブジェクトを生成
var peer = new Peer({ key: APIKEY, debug: 3});

// SpeechSynthesisオブジェクトを生成
var msg = new SpeechSynthesisUtterance();
msg.volume = 1; // 0 to 1
msg.rate = 1; // 0.1 to 10
msg.pitch = 2; //0 to 2
msg.lang = 'ja-JP';
msg.onend = function(e) {
    console.log('Finished in ' + event.elapsedTime + ' seconds.');
};

var conn;

// PeerIDを生成
peer.on('open', function(){
    $('#my-id').text(peer.id);
});

// 相手からのコールを受信したら自身のメディアストリームをセットして返答
peer.on('call', function(call){
    call.answer(window.localStream);
    step3(call);
});

// 相手からのDataChannelの接続要求を受信した場合
peer.on('connection', function(conn_) {
    conn = conn_;
    conn.on('open', function() {
        // メッセージを受信
        conn.on('data', function(data) {
            msg.text = data;
            speechSynthesis.speak(msg);
        });
    });
});

// エラーハンドラー
peer.on('error', function(err){
    alert(err.message);
    step2();
});

// イベントハンドラー
$(function(){

    // 相手に接続
    $('#make-call').click(function(){
        var call = peer.call($('#contactlist').val(), window.localStream);
        conn = peer.connect($('#contactlist').val());
        step3(call,conn);

    });

    // 切断
    $('#end-call').click(function(){
        existingCall.close();
        step2();
    });

    // 送信
    $('#sendtext').click(function(){
        conn.send($('#textdata').val());
    });

    // メディアストリームを再取得
    $('#step1-retry').click(function(){
        $('#step1-error').hide();
        step1();
    });

    // ステップ１実行
    step1();

    //ユーザリス取得開始
    setInterval(getUserList, 2000);

});

function step1 () {
    // メディアストリームを取得する
    navigator.getUserMedia({audio: true, video: true}, function(stream){
        $('#my-video').prop('src', URL.createObjectURL(stream));
        window.localStream = stream;
        step2();
    }, function(){ $('#step1-error').show(); });
}

function step2 () {
    //UIコントロール
    $('#step1, #step3').hide();
    $('#step2').show();
}

function step3 (call,conn) {
    // すでに接続中の場合はクローズする
    if (existingCall) {
        existingCall.close();
    }

    // 相手からのメディアストリームを待ち受ける
    call.on('stream', function(stream){
        $('#their-video').prop('src', URL.createObjectURL(stream));
        $('#step1, #step2').hide();
        $('#step3').show();
    });

    // 相手がクローズした場合
    call.on('close', step2);

    // DataChannel関連のイベント
    conn.on('open', function() {
        // メッセージを受信
        conn.on('data', function(data) {
            msg.text = data;
            speechSynthesis.speak(msg);
        });
    });

    // Callオブジェクトを保存
    existingCall = call;

    // UIコントロール
    $('#their-id').text(call.peer);
    $('#step1, #step2').hide();
    $('#step3').show();

}

function getUserList () {
    //ユーザリストを取得
    $.get('https://skyway.io/active/list/'+APIKEY,
        function(list){
            for(var cnt = 0;cnt < list.length;cnt++){
                if($.inArray(list[cnt],userList)<0 && list[cnt] != peer.id){
                    userList.push(list[cnt]);
                    $('#contactlist').append($('<option>', {"value":list[cnt],"text":list[cnt]}));
                }
            }
        }
    );
}

