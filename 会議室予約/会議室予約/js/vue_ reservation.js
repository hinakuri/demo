var app = Vue.createApp({
  data() {
    return {
      currentDate: new Date(),
      intervalType: "15",
      weekDays: [],
      highlightedCells: new Set(),
      startOfWeek: null,
      isModalOpen: false,
      backend_host:'',
      reservationSlotMap: {},
      newReservation: {
        name: "",
        room: "",
        start: "",
        end: "",
        participants: "",
        notes: ""
      },
      allday_flag:false,
      repeat_flag:false,
      isDailyView: false,
      selectedDate: null,
      schedule: [
        { "id": 1,reservation_id: 202505151000, name: "予約1",create_by: "山田太郎", date: "20250515", starttime: "10:00", endtime: "11:00" },
        { "id": 2,reservation_id: 202505151000, name: "予約4",create_by: "山田太郎", date: "20250515", starttime: "10:00", endtime: "11:00" },
        { "id": 3,reservation_id: 202505161100, name: "予約2",create_by: "山田太郎", date: "20250516", starttime: "11:00", endtime: "13:30" },
        { "id": 4,reservation_id: 202505151200, name: "予約3",create_by: "山田太郎", date: "20250515", starttime: "12:00", endtime: "13:00" }
      ],
      daily:{recurring_unit:"",pattern:"",startDate:"",endDate:""},
      weekly:{recurring_unit:"",weekday:[],startDate:"",endType:""},
      monthly:{recurring_unit:"",weeknumber:[],weekday:[],startDate:"",endDate:""},
      reservation_detail:{reservationName:"",reservationArea:"",startDay:"",startHour:"",startMinute:"",endDay:"",endHour:"",endMinute:"",puropose:"",attendee:"",note:""},
      getreservation_detail:{name: "予約1",create_by: "山田太郎",email: "yamada@kl.co.jp", place: "会議室",start_time: "10:30:00",end_time: "12:00:00",puropose: "月次報告",attendee: ["山田太郎", "田中正"],note: "表彰あり"
    }
    };
  },
  computed: {
    totalRows() {
        return this.intervalType === "30" ? 48 : this.intervalType === "15" ? 96 : 144;
    },
    selectedDayColIndex() {
      const index = this.weekDays.findIndex(d => d === this.selectedDate);
      return index >= 0 ? index + 1 : 1;
    },
    formattedWeekRange() {
      if (!this.startOfWeek) return ""; // startOfWeek が null の場合は空文字を返す
      const monday = this.startOfWeek;
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return `${this.formatDate(monday)} - ${this.formatDate(sunday)}`;
    }
  },
  watch: {
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
    this.calculateStartOfWeek();
    this.getWeekDates();
  },
  mounted() {
    this.assignReservationSlots();
    console.log("Vueアプリがマウントされました");
  },
  methods: {
    
    reservationRegistration: async  function() {

      const form = document.getElementById("reservation"); 

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
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
      let startTime = this.reservation_detail.startHour +":"+ this.reservation_detail.startMinute;
      let endTime = this.reservation_detail.endHour +":"+ this.reservation_detail.endMinute;
      let option =  daily.checked? this.daily : (weekly.checked? this.weekly: this.monthly)
      option.startDate = this.reservation_detail.startDay.replace(/-/g, '/');
      option.endDate = option.endDate.replace(/-/g, '/');
      let attendees = this.reservation_detail.attendee;

      // 配列以外（＝文字列など）の場合にsplit
      if (!Array.isArray(attendees) && typeof attendees === 'string') {
        attendees = attendees.split(',');
      }
      let body = {
        startTime: this.reservation_detail.startDay.replace(/-/g, '/') + " " +startTime,
        endTime: this.reservation_detail.endDay.replace(/-/g, '/') + " " +  endTime,
        name: this.reservation_detail.reservationName,
        place: this.reservation_detail.reservationArea,
        puropose: this.reservation_detail.puropose,
        attendee: attendees,
        note: this.reservation_detail.note,
        allday_flag: this.allday_flag,
        repeat_flag:this.repeat_flag,
        option: option
      }
      console.log(body); 
      path = "schedules"
      try {
        await this.executePost(path, body); 
        const response = await this.executeGet(path); 
        // this.schedule = response.schedule;
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

      const modal = document.getElementById("easyModal");
      modal.style.display = "none";
      this.reservation_detail = {};

  },

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

    toggleDay(day) {
      // Vue状態切り替え
      this.selectedDate = day;
      this.isDailyView = true;
      this.intervalType = "30"; 
      const oneday = document.getElementById('outputDate')
      oneday.textContent = day;

      const weeklyTable = document.querySelector('.weekly-table');
      const onceTable = document.querySelector('.day-table');
      const day10Table = document.querySelector('.day-10-table');
      const switchingUnit = document.getElementById('switching-unit');
      const thirtyMinits = document.getElementById("thirty-minits");
    
      weeklyTable.style.display = "none";
      onceTable.style.display = "block";
      day10Table.style.display = "none";
      switchingUnit.classList.remove("disp-none");

      if (thirtyMinits) thirtyMinits.checked = true;
    },

    changeoutputTable(){
      const tenMinits = document.getElementById("ten-minits");
      const thirtyMinits = document.getElementById("thirty-minits");
      const onceTable = document.querySelector('.day-table');
      const day10Table = document.querySelector('.day-10-table');
      if (tenMinits.checked){
        this.intervalType = "10"; 
        day10Table.style.display="block";
        onceTable.style.display="none";
      }
      if (thirtyMinits.checked){
        this.intervalType = "30"; 
        day10Table.style.display="none";
        onceTable.style.display="block";
      }
    },

    handleReservationClick(reservation) {
      const daily = document.getElementById('daily');
      const weekly = document.getElementById('weekly');
      const monthly = document.getElementById('monthly')

      // let body = {
      //   id: reservation.id
      // }
      // let path = "";

      // this.executePost(path,body).then(function(response){
            // this.reservation_detail = response.reservation_detail
      // }).bind(this)
      console.log(reservation);
      let response = this.getreservation_detail;
      const [sh, sm] = response.start_time.split(":");
      const [eh, em] = response.end_time.split(":");
      let rawDate = reservation.date;
      const formattedDate = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`

      this.reservation_detail= {reservationName:response.name,reservationArea:response.place,startDay:formattedDate,startHour:sh,startMinute:sm,endDay:formattedDate,endHour:eh,endMinute:em,puropose:response.puropose,attendee:response.attendee,note:response.note}

      const modal = document.getElementById("easyModal");
      const deletebutton = document.getElementById("deletebutton");
      deletebutton.classList.remove("disp-none");
      const buttons = document.querySelectorAll(".margin-r1");
      buttons.forEach(btn => {
        btn.style.margin = "0 50px";
      });


      modal.style.display = "block";
    },

    getTimeLabel(rowIndex) {
      if (this.intervalType === "30") {
        const hour = Math.floor(rowIndex / 2);
        const minutes = (rowIndex % 2) * 30;
        return `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      } else if(this.intervalType === "15"){
        const hour = Math.floor(rowIndex / 4);
        const minutes = (rowIndex % 4) * 15;
        return minutes === 0 ? `${String(hour).padStart(2, "0")}` : "";
      } else {
        const hour = Math.floor(rowIndex / 6);
        const minutes = (rowIndex % 6) * 10;
      return `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      }
    },

    assignReservationSlots() {
      const slotsByDay = {};

      for (const reservation of this.schedule) {
        const key = reservation.date;
        if (!slotsByDay[key]) slotsByDay[key] = [];

        const start = parseInt(reservation.starttime.replace(":", ""), 10);
        const end = parseInt(reservation.endtime.replace(":", ""), 10);

        let slotIndex = 0;
        let assigned = false;

        // 空いているスロットに入れる
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

        if (!assigned) {
          // 新しいスロットを作る
          slotsByDay[key].push(end);
          this.reservationSlotMap[reservation.reservation_id] = slotsByDay[key].length - 1;
        }
      }
    },

    getMaxOverlapForDay(colIndex) {
      let max = 0;
      for (let row = 0; row < this.totalRows; row++) {
        const cellId = this.generateCellId(row, colIndex);
        max = Math.max(max, this.getOverlapCount(cellId));
      }
      return max;
    },
    getReservationIdAt(rowIndex, colIndex, overlapIndex) {
      const cellId = this.generateCellId(rowIndex, colIndex);
      const reservations = this.getReservation(cellId);
      return reservations?.[overlapIndex]?.reservation_id || null;
    },

    getReservationCellStyle(rowIndex, colIndex, overlapIndex) {
  const baseWidth = this.intervalType !== "15" ? 980 : 140;
  const cellId = this.generateCellId(rowIndex, colIndex);
  const overlapCount = this.getOverlapCount(cellId);
  const widthPerSlot = baseWidth / overlapCount;

  const cellClass = this.getCellClass(rowIndex, colIndex, overlapIndex);

  let height = "35px"; // デフォルト高さ

  if (cellClass === "reservation-start" || cellClass === "reservation-end") {
    height = "33.5px"; // 上下だけちょっと小さくする
  }

  return {
    width: `${widthPerSlot}px`,
    minWidth: "50px",
    height: height,
    boxSizing: "border-box",
  };
},
    getCellStyle(rowIndex, colIndex) {
      const cellId = this.generateCellId(rowIndex, colIndex);
      const overlapCount = this.getOverlapCount(cellId);
      let style = { width: "145px", minWidth: "50px",border: overlapCount > 0 ? "none" : "1px solid #000",padding:overlapCount > 0 ? "0px" : "1px", borderRight: "1px solid black"};

      if (this.intervalType != "15"){
        style = { width: "1000px", minWidth: "50px",border: overlapCount > 0 ? "none" : "1px solid #000",padding:overlapCount > 0 ? "0px" : "1px", borderRight: "1px solid black" };
      }
    
    
      if (overlapCount > 1) {
        style.width = `${145 / overlapCount}px`; // 予約の数に応じて幅を調整
      }
    
      if (colIndex === 0) {
        style.width = "40px";
        style.borderBottom = "hidden";
      }
      if (rowIndex !== 0 && (rowIndex + 1) % 4 === 0) {
      }
    
      return style;
    },

    getCellClass(rowIndex, colIndex, overlapIndex) {
      const cellId = this.generateCellId(rowIndex, colIndex);
      const reservations = this.getReservation(cellId);
    
      if (!reservations || overlapIndex >= reservations.length) return "";
    
      const reservation = reservations[overlapIndex];
      const startTime = parseInt(reservation.starttime.replace(":", ""), 10);
      const endTime = parseInt(reservation.endtime.replace(":", ""), 10);
    
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
    
      if (currentTime === startTime) {
        return "reservation-start";
      } else if (normalizedNextTime === endTime) {
        return "reservation-end";
      } else if (currentTime > startTime && currentTime < endTime) {
        return "reservation-middle";
      }
    
      return "";
    },

    generateCellId(rowIndex, colIndex) {
      if (!this.startOfWeek || colIndex < 1) return "";
    
      const targetDate = new Date(this.startOfWeek);
      targetDate.setDate(this.startOfWeek.getDate() + (colIndex - 1));
    
      const baseHour = 0;
      let hours, minutes;
    
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
        /* ★ キーがなければ除外して true/false 判定に進まない ★ */
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

    // 前の週へ移動
    prevWeek() {
      if (this.isDailyView && this.selectedDate) {
        // 日付だけ1日前に戻す
        const d = new Date(this.selectedDate);
        d.setDate(d.getDate() - 1);
        this.selectedDate = this.formatDate(d);
        this.startOfWeek = this.getMonday(d);
        this.getWeekDates();
        // let path = "";

      // this.executePost(path,body).then(function(response){
            // this.schedule  = response.schedule 
      // }).bind(this)

        this.schedule =  [
           { "id": 1,reservation_id: 202505151000, name: "予約1",create_by: "山田太郎", starttime: "10:00", endtime: "11:00" },
          { "id": 2,reservation_id: 202505151000, name: "予約4",create_by: "山田太郎", starttime: "10:00", endtime: "11:00" },
          { "id": 4,reservation_id: 202505152400, name: "予約3",create_by: "山田太郎", starttime: "14:00", endtime: "15:00" },
          { "id": 5,reservation_id: 202505100800, name: "予約3",create_by: "山田太郎", starttime: "08:00", endtime: "09:00" }
        ]

        //YYYY/MM/DDをYYYYMMDDにする
        if (Object.keys(this.schedule).length !== 0 && this.schedule.constructor === Array) {
          const formattedDate = this.selectedDate.replace(/\//g, ""); // "2025/05/15" → "20250515"

          this.schedule = this.schedule.map(item => ({
            ...item,
            date: formattedDate
          }));
        }

        return;


      }

      this.currentDate.setDate(this.currentDate.getDate() - 7);
      this.calculateStartOfWeek();
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
        // this.executePost(path,body).then(function(response){
                    // this.schedule  = response.schedule 
              // }).bind(this)

        this.schedule =  [
          { "id": 3,reservation_id: 202505161100, name: "予約2",create_by: "山田太郎", starttime: "11:00", endtime: "13:30" },
        ]
        //YYYY/MM/DDをYYYYMMDDにする
        const formattedDate = this.selectedDate.replace(/\//g, "");

        this.schedule = this.schedule.map(item => ({
          ...item,
          date: formattedDate
        }));

        return;
      }
      this.currentDate.setDate(this.currentDate.getDate() + 7);
      this.calculateStartOfWeek();
      this.getWeekDates();
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
