var app = Vue.createApp({
  data() {
    return {
      currentDate: new Date(),//現在の日付
      intervalType: "15",//時間の感覚
      weekDays: [],//一週間の表示ようの配列
      highlightedCells: new Set(),//ハイライトされたセル
      startOfWeek: null,//週の開始
      isModalOpen: false,//ModalがOpenしてるかの判定
      backend_host:'',//APIリクエスト先のホテル名
      reservationSlotMap: {},//重複予約を解消するスロット割り当てマップ
      newReservation: {
        name: "",
        room: "",
        start: "",
        end: "",
        participants: "",
        notes: ""
      },
      allday_flag:false,//終日予約かどうか
      repeat_flag:false,//繰り返し予約かどうか
      isDailyView: false,//日表示か週表示か
      selectedDate: null,//選択された日付
      schedule: [],
      //繰り返し設定(毎日/毎週/毎月)
      daily:{recurring_unit:"",pattern:"",startDate:"",endDate:""},
      weekly:{recurring_unit:"",weekday:[],startDate:"",endType:""},
      monthly:{recurring_unit:"",weeknumber:[],weekday:[],startDate:"",endDate:""},
      //予約詳細情報
      reservation_detail:{reservationName:"",reservationArea:"",startDay:"",startHour:"",startMinute:"",endDay:"",endHour:"",endMinute:"",puropose:"",attendee:"",note:""},
      //ダミー詳細予約情報
      getreservation_detail:{name: "予約1",create_by: "山田太郎",email: "yamada@kl.co.jp", place: "会議室",start_time: "10:30:00",end_time: "12:00:00",puropose: "月次報告",attendee: ["山田太郎", "田中正"],note: "表彰あり"
    }
    };
  },
  computed: {
    //時間スロットの行数(10分:144行、15分:96行、30分:48行)
    totalRows() {
        return this.intervalType === "30" ? 48 : this.intervalType === "15" ? 96 : 144;
    },
    //選択された日付の曜日インデックス(1~7)
    selectedDayColIndex() {
      const index = this.weekDays.findIndex(d => d === this.selectedDate);
      return index >= 0 ? index + 1 : 1;
    },
    
    // 表示する週の範囲を "YYYY/MM/DD - YYYY/MM/DD" 形式で返す
    formattedWeekRange() {
      if (!this.startOfWeek) return ""; // startOfWeek が null の場合は空文字を返す
      const monday = this.startOfWeek;
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return `${this.formatDate(monday)} - ${this.formatDate(sunday)}`;
    },
    startDate() {
      if (!this.startOfWeek) return "";
      return this.formatDate(this.startOfWeek); // YYYY/MM/DD形式で返す
    },
    endDate() {
      if (!this.startOfWeek) return "";
      const sunday = new Date(this.startOfWeek);
      sunday.setDate(this.startOfWeek.getDate() + 6); // 月曜 + 6日 = 日曜
      return this.formatDate(sunday); // YYYY/MM/DD形式で返す
    }
  },
  watch: {
    //終日にチェックが入ったら、時間を0:00~24:00に設定
  allday_flag(newVal) {
    if (newVal) {
      // チェックが入ったときの処理
      this.reservation_detail.startHour = "00";
      this.reservation_detail.startMinute = "00";
      this.reservation_detail.endHour = "24";
      this.reservation_detail.endMinute = "00";
    }
  }
  },
  selectedColumns() {
    if (this.isDailyView && this.selectedDate) {
      const colIndex = this.weekDays.findIndex(d => d === this.selectedDate);
      return colIndex >= 0 ? [colIndex + 1] : [1]; 
    }
    return [1, 2, 3, 4, 5, 6, 7];
  },
  created() {
    // 初期化処理：週の開始日計算と週日付リストの生成
    this.calculateStartOfWeek();
    this.getWeekDates();
  },
  mounted() {
    // 各予約のスロット割当を事前に計算（重複対応用）
    this.assignReservationSlots();
    this.reservationInfoAcquisition();
    console.log("Vueアプリがマウントされました");
  },
  methods: {
    // 予約登録処理（モーダルフォームの送信）
    reservationRegistration: async  function() {

      const form = document.getElementById("reservation"); 

      if (!form.checkValidity()) {
        //入力されていなければ、入力してくださいと警告を出す
        form.reportValidity();
        return;
      }
      //繰り返しタイプを判定して設定
      if (daily.checked){
        this.daily.recurring_unit = "daily"
        console.log(this.daily);
      }else if (weekly.checked){
        this.daily.recurring_unit = "weekly"
        console.log(this.weekly);
      }else if (monthly.checked){
        this.daily.recurring_unit = "monthly"
        console.log(this.monthly);
      }
      //HH:MMにする
      let startTime = this.reservation_detail.startHour +":"+ this.reservation_detail.startMinute;
      //HH:MMにする
      let endTime = this.reservation_detail.endHour +":"+ this.reservation_detail.endMinute;
      // 選択された繰り返しオプション情報を整備
      let option =  daily.checked? this.daily : (weekly.checked? this.weekly: this.monthly)
      option.startDate = this.reservation_detail.startDay.replace(/-/g, '/');
      option.endDate = option.endDate.replace(/-/g, '/');
      //出席者情報(カンマ区切り文字列なら配列に変換)
      let attendees = this.reservation_detail.attendee;
      // 配列以外（＝文字列など）の場合にsplit
      if (!Array.isArray(attendees) && typeof attendees === 'string') {
        attendees = attendees.split(',');
      }
      
      
      //API送信用のリクエストボディを構築
      let body = {
        startTime: this.reservation_detail.startDay.replace(/-/g, '/') + " " +startTime,
        endTime: this.reservation_detail.endDay.replace(/-/g, '/') + " " +  endTime,
        name: this.reservation_detail.reservationName,
        place: this.reservation_detail.reservationArea,
        puropose: this.reservation_detail.puropose,
        attendee: attendees,
        note: this.sanitize(this.reservation_detail.note),
        allday_flag: this.allday_flag,
        repeat_flag:this.repeat_flag,
        option: option
      }
      console.log(body); 
      path = "schedules"
      try {
        //登録API呼び出し
        await this.executePost(path, body); 
        //最新の予約情報を取得
        const response = await this.executeGetParam(path,{startdate:this.startDate,enddate:this.endDate}); 
        // this.schedule = response.schedule;
        //ダミーのデータです。このような形で返ってくる想定
        this.schedule =  [
          { "id": 1,reservation_id: 202505151000, name: "予約1",create_by: "山田太郎", date: "20250515", starttime: "10:00", endtime: "11:00" },
          { "id": 2,reservation_id: 202505151000, name: "予約4",create_by: "山田太郎", date: "20250515", starttime: "10:00", endtime: "11:00" },
          { "id": 3,reservation_id: 202505161100, name: "予約2",create_by: "山田太郎", date: "20250516", starttime: "11:00", endtime: "13:30" },
          { "id": 4,reservation_id: 202505151200, name: "予約3",create_by: "山田太郎", date: "20250515", starttime: "12:00", endtime: "13:00" },
          { "id": 5,reservation_id: 202505100800, name: "予約3",create_by: "山田太郎", date: "20250510", starttime: "08:00", endtime: "09:00" }
        ]

      } catch (error) {
        console.error("更新中にエラー:", error);
      }
      // モーダルを閉じ、フォーム内容を初期化
      const modal = document.getElementById("easyModal");
      modal.style.display = "none";
      this.reservation_detail = {};

  },
  reservationInfoAcquisition:async  function(){
    let path = "schedules"
    const response = await this.executeGetParam(path,{startdate:this.startDate,enddate:this.endDate}); 
    // this.scedule = response.schedule;
    this.schedule = [
        { "id": 1,reservation_id: 202505151000, name: "予約1",create_by: "山田太郎", date: "20250515", starttime: "10:00", endtime: "11:00" },
        { "id": 2,reservation_id: 202505151000, name: "予約4",create_by: "山田太郎", date: "20250515", starttime: "10:00", endtime: "11:00" },
        { "id": 3,reservation_id: 202505161100, name: "予約2",create_by: "山田太郎", date: "20250516", starttime: "11:00", endtime: "13:30" },
        { "id": 4,reservation_id: 202505151200, name: "予約3",create_by: "山田太郎", date: "20250515", starttime: "12:00", endtime: "13:00" }
      ];
  },
  // 前の週へ移動
  prevWeek() {
    if (this.isDailyView && this.selectedDate) {
      // 日付だけ1日前に戻す
      const d = new Date(this.selectedDate);
      d.setDate(d.getDate() - 1);
      this.selectedDate = this.formatDate(d);
      this.startOfWeek = this.getMonday(d);
      this.getWeekDates();
      this.getDayReservation(this.selectedDate);

      return;


    }

    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.calculateStartOfWeek();
    this.getWeeklyReservation();
    this.getWeekDates();
  },
  resetWindow() {
    location.reload();
  },

  // 次の週へ移動
  nextWeek() {
    if (this.isDailyView && this.selectedDate) {

      // 日付だけ1日進める
      const d = new Date(this.selectedDate);
      d.setDate(d.getDate() + 1);
      this.selectedDate = this.formatDate(d);
      this.startOfWeek = this.getMonday(d);
      this.getWeekDates();
      this.getDayReservation(this.selectedDate);

      return;
    }
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.calculateStartOfWeek();
    this.getWeeklyReservation();
    this.getWeekDates();
  },

 // GETリクエスト共通処理
  executeGet: function(path){
    return axios.get(this.backend_host + path,{ withCredentials: true, headers: { 'content-type': 'application/json'}})
    .then(response =>{
      return response;
    }).catch(error => {
      var errorCode="";
      if (error.response){

      }else if (error.request){

      }else{

      }
    });
  },
  executeGetParam: function(path, params = {}) {
    return axios.get(this.backend_host + path, {
      params: params, // ← クエリパラメータ
      withCredentials: true,
      headers: { 'content-type': 'application/json' }
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      let errorCode = "";
      if (error.response) {
        // サーバーからのレスポンスにエラーが含まれている場合
      } else if (error.request) {
        // リクエストは送信されたが、応答がない場合
      } else {
        // リクエストのセットアップ中に何らかのエラーが発生した場合
      }
    });
  },
  // POSTリクエスト共通処理
  executePost: function (path, body){
    return axios.post (this.backend_host + path,body,{ withCredentials: true, headers: {'content-type': 'application/json'}})
    .then(response =>{
      return response;
    }).catch(error => {
      var errorCode="";
      if (error.response){

      }else if (error.request){

      }else{

      }
    })
  },
    // 週の始まり（月曜日）を計算
    calculateStartOfWeek() {
      const today = new Date(this.currentDate);
      const differenceToMonday = today.getDay() === 0 ? -6 : 1 - today.getDay();
      today.setDate(today.getDate() + differenceToMonday);
      this.startOfWeek = new Date(today);
    },
    // 日付をクリックした際に日別表示に切り替える
    toggleDay: async function(day) {
      // Vue状態切り替え
      this.selectedDate = day;
      this.isDailyView = true;
      //デフォルトを30分にする
      this.intervalType = "30"; 
      const oneday = document.getElementById('outputDate')
      oneday.textContent = day;

      const weeklyTable = document.querySelector('.weekly-table');
      const onceTable = document.querySelector('.day-table');
      const day10Table = document.querySelector('.day-10-table');
      const switchingUnit = document.getElementById('switching-unit');
      const thirtyMinits = document.getElementById("thirty-minits");
      //一週間分のテーブルを非表示にする
      weeklyTable.style.display = "none";
      //一日分のテーブルを表示する
      await this.getDayReservation(this.selectedDate)
      onceTable.style.display = "block";
      day10Table.style.display = "none";
      switchingUnit.classList.remove("disp-none");
      if (thirtyMinits) thirtyMinits.checked = true;
      

    },
    getDayReservation: async function(selectdate){
      path = "schedules"
      // const response = await this.executeGetParam(path,{"target_date":selectdate}).then(function(response) {
      // this.schedule = response.schedule;
      // }).bind(this);
      
        this.schedule =  [
          { "id": 3,reservation_id: 202505161100, name: "予約2",create_by: "山田太郎", starttime: "11:00", endtime: "13:30" },
        ]
        //YYYY/MM/DDをYYYYMMDDにする
        if (Object.keys(this.schedule).length !== 0 && this.schedule.constructor === Array) {
          const formattedDate = this.selectedDate.replace(/\//g, ""); 

          this.schedule = this.schedule.map(item => ({
            ...item,
            date: formattedDate
          }));
        }
    },
    sanitize(str) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },
    getWeeklyReservation: async function(){
      path = "schedules"
      // const response = await this.executeGetParam(path,{"startdate":this.startDate,"endDate":this.endDate}).then(function(response) {
      // this.schedule = response.schedule;
      // }).bind(this);
      this.schedule = [
        { "id": 1,reservation_id: 202506020100, name: "予約1",create_by: "山田太郎", date: "20250602", starttime: "01:00", endtime: "02:00" },
        { "id": 2,reservation_id: 202506030200, name: "予約4",create_by: "山田太郎", date: "20250603", starttime: "02:00", endtime: "03:00" },
      ];
    },

    //表示するテーブルの切り替え
    changeoutputTable(){
      const tenMinits = document.getElementById("ten-minits");
      const thirtyMinits = document.getElementById("thirty-minits");
      const onceTable = document.querySelector('.day-table');
      const day10Table = document.querySelector('.day-10-table');
      //10分単位に切り替え
      if (tenMinits.checked){
        this.intervalType = "10"; 
        day10Table.style.display="block";
        onceTable.style.display="none";
      }
      //30分単位に切り替え
      if (thirtyMinits.checked){
        this.intervalType = "30"; 
        day10Table.style.display="none";
        onceTable.style.display="block";
      }
    },

     // 予約クリック時に詳細情報をモーダルに展開して表示
    handleReservationClick(reservation) {
      const daily = document.getElementById('daily');
      const weekly = document.getElementById('weekly');
      const monthly = document.getElementById('monthly');

      // //※以下の実装は本来APIから予約詳細を取得する想定
      // let body = { id: reservation.id };
      // let path = "schedules";
      // this.executeGETParam(path,body).then(function(response) {
      //   this.reservation_detail = response.reservation_detail;
      // }).bind(this)

      console.log(reservation); // デバッグ用ログ出力

      // 現状は固定のダミー詳細データを使用
      let response = this.getreservation_detail;
      // 開始・終了時間を分解（"HH:mm:ss" → ["HH", "mm"]）
      const [sh, sm] = response.start_time.split(":");
      const [eh, em] = response.end_time.split(":");
      // 日付フォーマットを "YYYY-MM-DD" に変換（予約データは "YYYYMMDD"）
      let rawDate = reservation.date;
      const formattedDate = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
      // モーダル用フォームデータに設定
      this.reservation_detail = {
        reservationName: response.name,
        reservationArea: response.place,
        startDay: formattedDate,
        startHour: sh,
        startMinute: sm,
        endDay: formattedDate,
        endHour: eh,
        endMinute: em,
        puropose: response.puropose,
        attendee: response.attendee,
        note: response.note
      };
      // モーダル表示処理
      const modal = document.getElementById("easyModal");
      const deletebutton = document.getElementById("deletebutton");
      // 削除ボタンを表示
      deletebutton.classList.remove("disp-none");
      // ボタン間の余白調整
      const buttons = document.querySelectorAll(".margin-r1");
      buttons.forEach(btn => {
        btn.style.margin = "0 50px";
      });
      // モーダルを表示
      modal.style.display = "block";
    },
    //指定された行インデックスに対して時間ラベル返す
    getTimeLabel(rowIndex) {
      if (this.intervalType === "30") {
        //30分単位の場合(48行)
        const hour = Math.floor(rowIndex / 2);
        const minutes = (rowIndex % 2) * 30;
        return `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      } else if(this.intervalType === "15"){
        // 15分単位の場合（96行）：毎時の先頭だけラベルを表示（01, 02, ...）
        const hour = Math.floor(rowIndex / 4);
        const minutes = (rowIndex % 4) * 15;
        return minutes === 0 ? `${String(hour).padStart(2, "0")}` : "";
      } else {
        // 10分単位の場合（144行）：00:00, 00:10, 00:20, ...
        const hour = Math.floor(rowIndex / 6);
        const minutes = (rowIndex % 6) * 10;
      return `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      }
    },
    // 予約の重なりを解消するための、同じ日に複数の予約がある場合の割り当て先を決定する
    assignReservationSlots() {
      const slotsByDay = {};
      //すべての予約に対して処理する
      for (const reservation of this.schedule) {
        const key = reservation.date;
        // 初めての日付なら初期化
        if (!slotsByDay[key]) slotsByDay[key] = [];
        //スタート時刻を計算
        const start = parseInt(reservation.starttime.replace(":", ""), 10);
        //終了時刻を計算
        const end = parseInt(reservation.endtime.replace(":", ""), 10);

        let slotIndex = 0;
        let assigned = false;

        // 既存の列に空きがあれば、その列に表示させる
        for (slotIndex = 0; slotIndex < slotsByDay[key].length; slotIndex++) {
          const lastEnd = slotsByDay[key][slotIndex];

          if (start >= lastEnd) {
            // このスロットに配置可能
            slotsByDay[key][slotIndex] = end;
            this.reservationSlotMap[reservation.reservation_id] = slotIndex;
            assigned = true;
            break;
          }
        }
        //予約が重なっていれば新しくスロットを作成する
        if (!assigned) {
          // 新しいスロットを作る
          slotsByDay[key].push(end);
          this.reservationSlotMap[reservation.reservation_id] = slotsByDay[key].length - 1;
        }
      }
    },

    //予約が重なっている時間帯の個数を取得する
    getMaxOverlapForDay(colIndex) {
      let max = 0;
      for (let row = 0; row < this.totalRows; row++) {
        // 各行（時間帯）のセルIDを生成
        const cellId = this.generateCellId(row, colIndex);
        // そのセルでの予約の重なり数を取得
        max = Math.max(max, this.getOverlapCount(cellId));
      }
      return max;
    },
    getReservationIdAt(rowIndex, colIndex, overlapIndex) {
      //セルID生成
      const cellId = this.generateCellId(rowIndex, colIndex);
       //セルに属する予約の一覧を取得
      const reservations = this.getReservation(cellId);
      return reservations?.[overlapIndex]?.reservation_id || null;
    },
    // 各予約セルのスタイル（幅・高さ）を返す
    getReservationCellStyle(rowIndex, colIndex, overlapIndex) {
      //ベースの横の広さを指定
      const baseWidth = this.intervalType !== "15" ? 980 : 140;
      //セルのIDを作成
      const cellId = this.generateCellId(rowIndex, colIndex);
      //予約の重なり数を計算
      const overlapCount = this.getOverlapCount(cellId);
      //重なり数によって表示する予約の幅を設定
      const widthPerSlot = baseWidth / overlapCount;
      // の予約が「開始行」「中間行」「終了行」どれかを取得
      const cellClass = this.getCellClass(rowIndex, colIndex, overlapIndex);

      let height = "35px"; // デフォルト高さ

      if (cellClass === "reservation-start" || cellClass === "reservation-end") {
        height = "33.5px"; // 上下だけちょっと小さくする
      }
       //スタイルをオブジェクト形式で返す
      return {
        width: `${widthPerSlot}px`,
        minWidth: "50px",
        height: height,
        boxSizing: "border-box",
      };
    },
    getCellStyle(rowIndex, colIndex) {
      //セルID生成して対象時間帯・曜日の特定
      const cellId = this.generateCellId(rowIndex, colIndex);
      //このセル内に存在する予約の数を取得
      const overlapCount = this.getOverlapCount(cellId);
      //15分単位のスタイル
      let style = { width: "145px", minWidth: "50px",border: overlapCount > 0 ? "none" : "1px solid #000",padding:overlapCount > 0 ? "0px" : "1px", borderRight: "1px solid black"};
      //15分以外の時のスタイル
      if (this.intervalType != "15"){
        style = { width: "1000px", minWidth: "50px",border: overlapCount > 0 ? "none" : "1px solid #000",padding:overlapCount > 0 ? "0px" : "1px", borderRight: "1px solid black" };
      }
    
      // 複数予約が重なっている場合、等分して幅を狭くする
      if (overlapCount > 1) {
        style.width = `${145 / overlapCount}px`; // 予約の数に応じて幅を調整
      }
      //0列目は固定幅で下線を表示しない
      if (colIndex === 0) {
        style.width = "40px";
        style.borderBottom = "hidden";
      }
      //一時間ごとに横線を入れる
      if (rowIndex !== 0 && (rowIndex + 1) % 4 === 0) {
      }
    
      return style;
    },
    //各セルに適用するべきクラスを作成
    getCellClass(rowIndex, colIndex, overlapIndex) {
      //対象のセルIDを作成
      const cellId = this.generateCellId(rowIndex, colIndex);
      //予約一覧を取得
      const reservations = this.getReservation(cellId);
      // 予約がなければ何も描画しない
      if (!reservations || overlapIndex >= reservations.length) return "";
      // 対象の予約を取得
      const reservation = reservations[overlapIndex];
      // 開始／終了時刻を数値（"HH:mm" → 1030 など）に変換
      const startTime = parseInt(reservation.starttime.replace(":", ""), 10);
      const endTime = parseInt(reservation.endtime.replace(":", ""), 10);
      // 6. このセルの時刻（HHMM）を計算
      let currentTime;
      if (this.intervalType === "30") {
        const hour = Math.floor(rowIndex / 2);
        const minutes = (rowIndex % 2) * 30;
        currentTime = hour * 100 + minutes;
      } else if(this.intervalType === "15") {
        const hour = Math.floor(rowIndex / 4);
        const minutes = (rowIndex % 4) * 15;
        currentTime = hour * 100 + minutes;
      } else{
        const hour = Math.floor(rowIndex / 6);
        const minutes = (rowIndex % 6) * 10;
        currentTime = hour * 100 + minutes;
      }
    
      const nextTime = currentTime + (this.intervalType === "30"? 30: this.intervalType === "15"? 15: 10);
      const nextTimeHH = Math.floor(nextTime / 100);
      const nextTimeMM = nextTime % 100;
      const normalizedNextTime = nextTimeMM >= 60 ? (nextTimeHH + 1) * 100 : nextTime;
       // 予約の開始時間かどうか
      if (currentTime === startTime) {
        return "reservation-start";
        // 次スロットの開始が予約の終了と一致していれば終了セル
      } else if (normalizedNextTime === endTime) {
        return "reservation-end";
        // 11. その中間なら中間クラスを返す
      } else if (currentTime > startTime && currentTime < endTime) {
        return "reservation-middle";
      }
      //該当しなければクラスなし
      return "";
    },

    generateCellId(rowIndex, colIndex) {
       // startOfWeek が未定義 or 無効な列（例：ヘッダ列）なら空文字を返す
      if (!this.startOfWeek || colIndex < 1) return "";
      // 対象日の Date オブジェクトを計算（週の開始日 + 列インデックス）
      const targetDate = new Date(this.startOfWeek);
      targetDate.setDate(this.startOfWeek.getDate() + (colIndex - 1));
    
      const baseHour = 0;
      let hours, minutes;
      // 行インデックスから時間と分を計算
      if (this.intervalType === "30") {
        hours = Math.floor(rowIndex / 2) + baseHour;
        minutes = (rowIndex % 2) * 30;
      } else if(this.intervalType === "15") {
        hours = Math.floor(rowIndex / 4) + baseHour;
        minutes = (rowIndex % 4) * 15;
      } else{
        hours = Math.floor(rowIndex / 6) + baseHour;
        minutes = (rowIndex % 6) * 10;
      }
      // フォーマット：YYYYMMDDHHMM の文字列を返す
      return `${targetDate.getFullYear()}${String(targetDate.getMonth() + 1).padStart(2, "0")}${String(targetDate.getDate()).padStart(2, "0")}${String(hours).padStart(2, "0")}${String(minutes).padStart(2, "0")}`;
    },

    getCellText(rowIndex, colIndex, overlapIndex) {
      const cellId = this.generateCellId(rowIndex, colIndex);
      const reservations = this.getReservation(cellId);
    
      if (!reservations) return "";
    
      if (overlapIndex < reservations.length) {
        return reservations[overlapIndex].name;
      }
      return "";
    },
    // 今週の日付リストを取得

    getWeekDates() {
      if (!this.startOfWeek) return;
      this.weekDays = Array.from({ length: 7 }, (_, i) => {
        let currentDay = new Date(this.startOfWeek);
        currentDay.setDate(this.startOfWeek.getDate() + i);
        return this.formatDate(currentDay);
      });
    },

    // 予約情報を取得
    getReservation(cellId) {
      const cellDate = cellId.slice(0, 8);              // YYYYMMDD
      const cellTime = parseInt(cellId.slice(8, 12), 10); // HHMM

      const overlappingReservations = this.schedule.filter(reservation => {
        /* キーがなければ除外して true/false 判定に進まない */
        if (!reservation.date || !reservation.starttime || !reservation.endtime) {
          return false;
        }

        const reservationDate = reservation.date.replace(/\//g, '');
        const startTime = parseInt(reservation.starttime.replace(':', ''), 10);
        const endTime   = parseInt(reservation.endtime.replace(':', ''), 10);

        return reservationDate === cellDate &&
              cellTime >= startTime &&
              cellTime <  endTime;
      });

      /* 空配列でも .sort() は問題なく動く */
      overlappingReservations.sort(
        (a, b) => this.reservationSlotMap[a.reservation_id] - this.reservationSlotMap[b.reservation_id]
      );

      return overlappingReservations;   // [{ }] の場合は最終的に []
    },
    // 予約が重なる数を返す
    getOverlapCount(cellId) {
      const reservations = this.getReservation(cellId);
      return reservations ? reservations.length : 0; // 予約がない場合は0
    },

    getMaxOverlapForDay(colIndex) {
      let max = 0;
      for (let row = 0; row < this.totalRows; row++) {
        const cellId = this.generateCellId(row, colIndex);
        max = Math.max(max, this.getOverlapCount(cellId));
      }
      return max;
    },

    // セルをクリックしたら強調表示（ハイライト）する
    highlightCell(rowIndex, colIndex) {
      const cellId = this.generateCellId(rowIndex, colIndex);
      if (!cellId) return;
      if (this.highlightedCells.has(cellId)) {
        this.highlightedCells.delete(cellId);
      } else {
        this.highlightedCells.add(cellId);
      }
    },

    // 指定した日付の週の月曜日を取得
    getMonday(date) {
      const d = new Date(date);
      d.setDate(d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1));
      return d;
    },

    // 日付を YYYY/MM/DD 形式にフォーマット
    formatDate(date) {
      return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
    },
    changeRepeatUnit: function(){

      const daily = document.getElementById('daily');
      const weekly = document.getElementById('weekly');
      const monthly = document.getElementById('monthly')
      const dairyoptions = document.getElementById('dairy-options');
      const weeklyoptions = document.getElementById('weekly-options');
      const monthlyoptions = document.getElementById('monthly-options');

      if (daily.checked) {
        dairyoptions.style.display = 'block';
      } else {
        dairyoptions.style.display = 'none';
      }
      if (weekly.checked) {
        weeklyoptions.style.display ='block';
      } else{
        weeklyoptions.style.display = 'none';
      }
      if (monthly.checked) {
        monthlyoptions.style.display ='block';
      } else{
        monthlyoptions.style.display = 'none';
      }
    },

    // モーダルを開く
    openModal() {
      this.reservation_detail={reservationName:"",reservationArea:"",startDay:"",startHour:"",startMinute:"",endDay:"",endHour:"",endMinute:"",puropose:"",attendee:"",note:""}
      //今日の日付を取得する
      const today = new Date().toISOString().slice(0, 10); 
      this.reservation_detail.startDay = today;
      this.reservation_detail.endDay = today;
      const modal = document.getElementById('easyModal');
      this.isModalOpen = true;

      modal.style.display = "block";
      const deletebutton = document.getElementById("deletebutton");
      if (!deletebutton.classList.contains("disp-none")){
        deletebutton.classList.add("disp-none")
        const buttons = document.querySelectorAll(".margin-r1");
        buttons.forEach(btn => {
          btn.style.margin = "0 80px";
        })
      }
    },

    // モーダルを閉じる
    closeModal() {
      const modal = document.getElementById('easyModal');
      this.isModalOpen = false;
      modal.style.display = "none";
    },

    // 予約を登録
    addReservation() {
      console.log("予約登録:", this.newReservation);
      this.isModalOpen = false;
    }
  }
});

app.mount("#app");