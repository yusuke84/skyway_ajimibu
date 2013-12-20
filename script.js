/**
 * Created by ______ on 2013/12/20.
 */

//APIキー
var APIKEY = '';

//ユーザーリスト
var userList = [];

//Callオブジェクト
var existingCall;

// Compatibility

// PeerJSオブジェクトを生成


// PeerIDを生成


// 相手からのコールを受信したら自身のメディアストリームをセットして返答


// エラーハンドラー


// イベントハンドラー
$(function(){

    // 相手に接続

    // 切断

    // メディアストリームを再取得

    // ステップ１実行

    //ユーザリス取得開始

});

function step1 () {
    // メディアストリームを取得する

}

function step2 () {
    //UIコントロール
    $('#step1, #step3').hide();
    $('#step2').show();
}

function step3 (call) {
    // すでに接続中の場合はクローズする

    // 相手からのメディアストリームを待ち受ける

    // 相手がクローズした場合

    // Callオブジェクトを保存

    // UIコントロール
    $('#their-id').text(call.peer);
    $('#step1, #step2').hide();
    $('#step3').show();

}

function getUserList () {
    //ユーザリストを取得

}

