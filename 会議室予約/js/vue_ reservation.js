var app = Vue.createApp({
  data() {
    return {
      currentDate: new Date(),
      weekDays: [],
      highlightedCells: new Set(),
      startOfWeek: null,
      isModalOpen: false,
      newReservation: {
        name: "",
        room: "",
        start: "",
        end: "",
        participants: "",
        notes: ""
      },
      schedule: [
        { reservation_id: 202503011000, name: "予約1", date: "20250301", starttime: "10:00", endtime: "11:00" },
        { reservation_id: 202503011000, name: "予約4", date: "20250301", starttime: "10:00", endtime: "11:30" },
        { reservation_id: 202503011100, name: "予約2", date: "20250301", starttime: "11:00", endtime: "13:30" },
        { reservation_id: 202510302400, name: "予約3", date: "20250302", starttime: "14:00", endtime: "15:00" }
      ]
    };
  },
  computed: {
    formattedWeekRange() {
      if (!this.startOfWeek) return ""; // startOfWeek が null の場合は空文字を返す
      const monday = this.startOfWeek;
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return `${this.formatDate(monday)} - ${this.formatDate(sunday)}`;
    }
  },
  created() {
    this.calculateStartOfWeek();
    this.getWeekDates();
  },
  mounted() {
    console.log("Vueアプリがマウントされました");
  },
  methods: {
    // 週の始まり（月曜日）を計算
    calculateStartOfWeek() {
      const today = new Date(this.currentDate);
      const differenceToMonday = today.getDay() === 0 ? -6 : 1 - today.getDay();
      today.setDate(today.getDate() + differenceToMonday);
      this.startOfWeek = new Date(today);
    },
    getTimeLabel(rowIndex) {
      const baseHour = 0; 
      if (rowIndex % 4 === 0) {
        const hours = Math.floor(rowIndex / 4) + baseHour;
        return `${hours}`; 
      } else {
        return ""; 
      }
    },
    getMaxOverlap(rowIndex) {
      let maxOverlap = 1;
      for (let colIndex = 1; colIndex <= 7; colIndex++) {
        const cellId = this.generateCellId(rowIndex, colIndex);
        const overlapCount = this.getOverlapCount(cellId);
        if (overlapCount > maxOverlap) {
          maxOverlap = overlapCount;
        }
      }
      return maxOverlap;
    },
    getCellStyle(rowIndex, colIndex) {
      let style = { width: "145px", minWidth: "50px" };
    
      const cellId = this.generateCellId(rowIndex, colIndex);
      const overlapCount = this.getOverlapCount(cellId);
    
      if (overlapCount > 1) {
        style.width = `${145 / overlapCount}px`; // 予約の数に応じて幅を調整
      }
    
      if (colIndex === 0) {
        style.width = "40px";
        style.borderBottom = "hidden";
      }
      if (rowIndex !== 0 && (rowIndex + 1) % 4 === 0) {
        style.borderBottom = "solid 3px black";
      }
    
      return style;
    },
    getReservationCellStyle(rowIndex, colIndex) {
      let style = { width: "145px", minWidth: "50px" };
    
      const cellId = this.generateCellId(rowIndex, colIndex);
      const overlapCount = this.getOverlapCount(cellId);
    
      if (overlapCount > 1) {
        style.width = `${145 / overlapCount}px`; // 予約の数に応じて幅を調整
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
      const currentHour = Math.floor(rowIndex / 4);
      const currentMinutes = (rowIndex % 4) * 15;
      const currentTime = currentHour * 100 + currentMinutes;
    
      if (currentTime === startTime) {
        return "reservation-start";
      } else if (currentTime > startTime && currentTime < endTime) {
        return "reservation-middle";
      } else if (currentTime === endTime) {
        return "reservation-end";
      }
    
      return "";
    },

    generateCellId(rowIndex, colIndex) {
      if (!this.startOfWeek || colIndex < 1) return ""; 
    
      const targetDate = new Date(this.startOfWeek);
      targetDate.setDate(this.startOfWeek.getDate() + (colIndex - 1)); 
    
      const baseHour = 0;
      const hours = Math.floor(rowIndex / 4) + baseHour;
      const minutes = (rowIndex % 4) * 15; 
    
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
      const cellDate = cellId.substring(0, 8); // YYYYMMDD
      const cellTime = parseInt(cellId.substring(8, 12), 10); // HHMM
    
      const overlappingReservations = this.schedule.filter((reservation) => {
        const reservationDate = reservation.date.replace(/\//g, ""); // YYYYMMDD
        const startTime = parseInt(reservation.starttime.replace(":", ""), 10); // HHMM
        const endTime = parseInt(reservation.endtime.replace(":", ""), 10); // HHMM
    
        return reservationDate === cellDate && cellTime >= startTime && cellTime < endTime;
      });
    
      
      // 予約がない場合は空の配列を返す（null ではなく [])
      return overlappingReservations.length > 0 ? overlappingReservations : [];
    },
    // 予約が重なる数を返す
    getOverlapCount(cellId) {
      const reservations = this.getReservation(cellId);
      return reservations ? reservations.length : 0; // 予約がない場合は0
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
      this.currentDate.setDate(this.currentDate.getDate() - 7);
      this.calculateStartOfWeek();
      this.getWeekDates();
    },

    // 次の週へ移動
    nextWeek() {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
      this.calculateStartOfWeek();
      this.getWeekDates();
    },

    // モーダルを開く
    openModal() {
      this.isModalOpen = true;
    },

    // モーダルを閉じる
    closeModal() {
      this.isModalOpen = false;
    },

    // 予約を登録
    addReservation() {
      console.log("予約登録:", this.newReservation);
      this.isModalOpen = false;
    }
  }
});

app.mount("#app");
