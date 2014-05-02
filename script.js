//APIキー
var APIKEY = 'xh9ggj8ndnyaatt9';

//Callオブジェクト
var existingCall;

var DEBUG_MODE = 3; // debugLebelに従ってlogを出力(0:ログ出力なし, 1:エラーのみ, 2:エラーと警告, 3:すべて出力)
var peer = new Peer({key: APIKEY, debug:DEBUG_MODE}); // peerの生成(コネクションの数毎にnew)


peer.on('open', function(id){ // peerServerへの接続が確立すると発生
    console.log("My Peer id: " + id); 
    $('#my-id').text(id);
});


// 相手からのコールを受信したら自身のメディアストリームをセットして返答
peer.on('call', function(call){
    //【問題３】自分のビデオストリーム（window.localStream）を相手に送信するコードを書いて下さい
    //【回答３】
    call.answer(window.localStream);

    step3(call);
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
        //【問題４】自分のビデオストリーム（window.localStream）を用いて相手に発信する為のコードを書いて下さい
	//【回答４】
	var call = peer.call($('#callto-id').val(), window.localStream);
        step3(call);
    });

    // 切断
    $('#end-call').click(function(){
        existingCall.close();
        step2();
    });

    // メディアストリームを再取得
    $('#step1-retry').click(function(){
        $('#step1-error').hide();
        step1();
    });

    // ステップ１実行
    step1();

});

// メディアストリームを取得する
function step1 () {
    // 【問題５】getUserMediaの以下のコード内のコメントを参考にコードを完成させえて下さい
    // 【回答５】//getUserMediaのオプション指定
    navigator.getUserMedia({audio:true, video:true}, function(stream){
        // 相手からのビデオストリームを$('#my-video')にセットする
	$('#my-video').prop('src', window.URL.createObjectURL(stream));
        // 取得したストリームを後で使うためにwindowオブジェクトに保存
	window.localStream = stream;

        step2();
    }, function(){ $('#step1-error').show(); });　// error Callback
}

function step2 () {
    //UIコントロール
    $('#step1, #step3').hide();
    $('#step2').show();
}

function step3 (call) {
    // すでに接続中の場合はクローズする
    if (existingCall) {
        existingCall.close();
    }

    // 相手からのメディアストリームを待ち受ける
    call.on('stream', function(stream){
        // 【問題６】相手からのビデオストリームを$('their-video')にセットするコードを書いて下さい
	// 【回答６】
	$('#their-video').prop('src', window.URL.createObjectURL(stream));
        
        $('#step1, #step2').hide();
        $('#step3').show();
    });

    // 相手がクローズした場合
    call.on('close', step2);

    // Callオブジェクトを保存
    existingCall = call;

    // UIコントロール
    $('#their-id').text(call.peer);
    $('#step1, #step2').hide();
    $('#step3').show();

}
