//HTMLのdata-table要素を取得する
var tableFile = document.getElementById('data-table');
var once30TabeleFile = document.getElementById('once-data-table30');
var once10TabeleFile = document.getElementById('once-data-table10');
var countTime = 0;



countTime = new Date(2024,0,1,0,0);

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
            const deletebutton = document.getElementById("deletebutton");
            if (!deletebutton.classList.contains("disp-none")){
              deletebutton.classList.add("disp-none")
              const buttons = document.querySelectorAll(".margin-r1");
              buttons.forEach(btn => {
                btn.style.margin = "0 80px";
              })
            }
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
    
