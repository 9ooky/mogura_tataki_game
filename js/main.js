'use strict';
    {
      const hole = document.querySelectorAll('.hole');
      const score_board = document.querySelector('.score');
      const start_btn = document.querySelector('.start-btn');
      const result_layer = document.querySelector('.result-wrap');
      const result = document.querySelector('.result');
      const progress = document.querySelector('.progress');
      const retry_btn = document.querySelector('.retry-btn');
      const time_limit = 25;
      const motions = ['motion_1', 'motion_2', 'motion_3', 'motion_4'];
      let start_time;
      let left_percentage;
      let count_time;
      let repeat_time;
      let score = 0;
      let interval = 1500;
      let appear_interval = 2000;
      let mode = 'easy';
      let mode_bar;


      // 制限時間を管理する処理
      const countDown = () => {
        const d = new Date(Date.now() - start_time);
        const m = d.getMinutes();
        const s = d.getSeconds();
        left_percentage = Math.floor(((time_limit - s)/time_limit)*100);
        progress.style.width = `${left_percentage}%`;
        changeMode(s);
      };

      // 残り時間によって難易度を変える処理
      const changeMode = (s) => {
        if (s > time_limit - 1) {
          timeOut();
        } else {
          if (s > time_limit/3 && time_limit*2/3 > s) {
            if (mode !== 'normal') {
              mode = 'normal';
              interval = 1100;
              appear_interval = 1300;
            }
          } else if (s > time_limit*2/3) {
            if(mode !== 'hard') {
              mode = 'hard';
              interval = 800;
              appear_interval = 900;
            }
          }
          count_time = setTimeout(() => {
            countDown();
          }, 10);
        };
      };
      // STARTボタンを押した時の処理
      start_btn.addEventListener('click', () => {
          start_time = Date.now();
          countDown();
          repeatMoveMole();
      });
      // 時間ぎれになった時の処理
      const timeOut = () => {
        clearTimeout(count_time);
        clearTimeout(repeat_time);
        displayResult();
      };
      // 結果を表示する処理
      const displayResult = () => {
        result.textContent = score;
        result_layer.classList.add('finish');
      }
      // モグラが現れたり消えたりする処理
      const moveMole = () => {
        let out_num = Math.floor(Math.random() * 6);
        hole.forEach((item, index) => {
          const mole = document.createElement('div');
          mole.classList.add('mole');
          // モグラのアニメーションを制御する処理
          if (mode == 'easy') {
            mole.style.animation = `motion_1 ${appear_interval/1000}s`;
          } else if (mode == 'normal') {
            mode_bar = Math.floor(Math.random() * 2);
            mole.style.animation = `${motions[mode_bar]} ${appear_interval/1000}s`;
          } else if (mode == 'hard') {
            mode_bar = Math.floor(Math.random() * 4);
            mole.style.animation = `${motions[mode_bar]} ${appear_interval/1000}s`;
          }
          // mole.style.animation = `motion_1 ${appear_interval/1000}s`;
          if (index == out_num) {
            // モグラを消す処理
            hole[index].appendChild(mole);
            setTimeout(() => {
              if (hole[index].hasChildNodes()){
                hole[index].removeChild(mole);
              }
            }, appear_interval);
            hitMole(index);
          }
        });
      };
      // モグラのタップした時の処理
      const hitMole = index => {
        const mole = hole[index].firstElementChild;
        mole.addEventListener('click', () => {
            if (hole[index].hasChildNodes()) {
              score++;
              score_board.textContent = score;
              hole[index].removeChild(mole);
            }
        });
      };
      // 一定時間おきにモグラが出たり入ったりを繰り返す処理
      const repeatMoveMole = () => {
        moveMole();
        repeat_time = setTimeout(repeatMoveMole, interval);
      };
      // RETRYボタンを押した時の処理
      retry_btn.addEventListener('click', () => window.location.reload());
    }
