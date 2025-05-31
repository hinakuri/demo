//HTMLのdata-table要素を取得する
var tableFile = document.getElementById('data-table');
var once30TabeleFile = document.getElementById('once-data-table30');
var once10TabeleFile = document.getElementById('once-data-table10');
var countTime = 0;




 function toggleDay(){
  const thirtyMinits = document.getElementById("thirty-minits");
  const weeklyTable = document.querySelector('.weekly-table');
  const onceTable = document.querySelector('.day-table');
  const day10Table = document.querySelector('.day-10-table');
  const switchingUnit = document.getElementById('switching-unit');
  const outputDate = document.getElementById("outputDate");

      outputDate.textContent = "2024/10/14";
      switchingUnit.classList.remove("disp-none");
      weeklyTable.style.display = "none";
      onceTable.style.display ="block";
      thirtyMinits.checked;
      day10Table.style.display = "none"
}
      document.getElementById("repeat").addEventListener("change", function() {
      document.getElementById("repeat_settings").classList.toggle("hidden", !this.checked);
      });
      
      const buttonOpen = document.getElementById('modalOpen');
      const modal = document.getElementById('easyModal');
      const buttonClose = document.getElementsByClassName('modalClose')[0];

      document.addEventListener("DOMContentLoaded", function () {
        const modal = document.getElementById("easyModal");
        const openButton = document.getElementById("modelOpen");
        const closeButton = modal.querySelector(".button:last-child"); // キャンセルボタン
    
        // モーダルを表示
        openButton.addEventListener("click", function () {
            modal.style.display = "block";
        });
    
        // モーダルを非表示
        closeButton.addEventListener("click", function () {
            modal.style.display = "none";
        });
    
        // モーダル外をクリックしたら閉じる
        window.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    });
      function changeRepeatUnit(){

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
      }

      function changeoutputTable(){
        const tenMinits = document.getElementById("ten-minits");
        const thirtyMinits = document.getElementById("thirty-minits");
        const onceTable = document.querySelector('.day-table');
        const day10Table = document.querySelector('.day-10-table');
        if (tenMinits.checked){
          day10Table.style.display="block";
          onceTable.style.display="none";
        }
        if (thirtyMinits.checked){
          day10Table.style.display="none";
          onceTable.style.display="block";
        }
      }
    