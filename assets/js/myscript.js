var qs = document.querySelector.bind(document);
var qsa = document.querySelectorAll.bind(document);

const audio = qs('#audio');
const cdThumb = qs('.cd');
const playBtn = qs('.play');
const progressBar = qs('#progress');
const shuffleBtn = qs('.shuffleBtn');
const repeatBtn = qs('.repeatBtn');
const nextBtn = qs('.nextBtn');
const prevBtn = qs('.prevBtn');
var cdThumbAnimate = cdThumb.animate([
    {
        transform: "rotate(0deg)"
    },
    {
        transform: "rotate(360deg)"
    }
], {
    duration: 10000,
    easing: "linear",
    iterations: Infinity

});
const app = {
    currentIndex: 4,
    isPlaying: false,
    isShuffle: false,
    isRepeat: false,
    songs: [
        {
            name: 'Faded',
            singer: 'Alan Walker',
            path: './assets/music/AlanWalker-Faded-YouTube.mp3',
            image: './assets/images/Alan_Walker_-_Faded.png'
        },
        {
            name: 'The Nights',
            singer: 'Avicii',
            path: './assets/music/Avicii-TheNights-YouTube.mp3',
            image: './assets/images/Avicii-The-nights.png'
        },
        {
            name: 'Waiting for love',
            singer: 'Avicii',
            path: './assets/music/Avicii-WaitingForLove-YouTube.mp3',
            image: './assets/images/Waiting-for-love.png'
        },
        {
            name: 'Unity',
            singer: 'The Fat Rat',
            path: './assets/music/TheFatRat-Unity-YouTube.mp3',
            image: './assets/images/The-fat-rat.png'
        },
        {
            name: 'Mơ',
            singer: 'Vũ Cát Tường',
            path: './assets/music/Mơ -- Lyrics Video -- - Vũ Cát Tường - YouTube.mp3',
            image: './assets/images/MơVũCátTường.jpg'
        },
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './assets/music/Vicetone-Nevada(ft.CoziZuehlsdorff)-YouTube.mp3',
            image: './assets/images/Nevada.png'
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, idx) => {
            return `<div class="song ${idx === this.currentIndex ? "active" : ''}" id="song-${idx}">
                <div class="thumb" style="background-image: url(${song.image});">
                </div>
                <div class="body">
                    <h3>${song.name}</h3>
                    <p>${song.singer}</p>
                </div>
                <div class="option"><i class="fa-solid fa-ellipsis"></i></div>
            </div>`
        })
        let playlist = qs('.playlist');
        playlist.innerHTML = htmls.join('');

    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }

        });
    },
    handleEvents: function () {
        const _this = this;
        var playlist = qs('.playlist');
        const cd = qs('.cd');
        const cdWidth = cd.offsetWidth;
        //---------------Xử lí phóng to thu nhỏ-------------
        playlist.onscroll = function () {
            const playlistScrollTop = playlist.scrollTop;
            // var cdNewWidth = cdWidth - playlistScrollTop;
            const finalWidth = (cdWidth - playlistScrollTop) > 0 ? (cdWidth - playlistScrollTop) : 0;
            cd.style.width = finalWidth + 'px';
            cd.style.height = finalWidth + 'px';
            cd.style.opacity = finalWidth / cdWidth;
        }
        //----------------Xử lí tạm dừng/ chạy nhạc-----------
        playBtn.onclick = function () {
            if (_this.isPlaying) {

                audio.pause();
            }
            else {
                playBtn.classList.remove('playing');
                audio.play();

            }
        }
        //-----------Khi nhạc chạy------------
        audio.onplay = function () {
            _this.isPlaying = true;
            playBtn.classList.add('playing');
            cdThumbAnimate.play();
        }
        //------------Xử lí nhạc dừng---------
        audio.onpause = function () {
            _this.isPlaying = false;
            playBtn.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //--------------Khi tien do bai hat thay doi-------
        audio.ontimeupdate = function () {
            if (audio.duration) {
                var duration = audio.duration;
                var currentTime = audio.currentTime;
                progressBar.value = Math.floor(currentTime / duration * 100);
            }
        }
        //--------Tua bài-----------
        progressBar.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            console.log(audio.duration);
            audio.currentTime = seekTime;
        }
        //----------Trộn bài-------
        shuffleBtn.onclick = function () {
            if (_this.isShuffle) {
                shuffleBtn.classList.remove('isShuffle');
                _this.isShuffle = false;
            }
            else {
                shuffleBtn.classList.add('isShuffle');
                _this.isShuffle = true;
            }
            console.log(_this.isShuffle);
        };
        //-----------RepeatBtn------------
        repeatBtn.onclick = function () {
            if (_this.isRepeat) {
                repeatBtn.classList.remove('isRepeat');
                _this.isRepeat = false;
            }
            else {
                repeatBtn.classList.add('isRepeat');
                _this.isRepeat = true;
            }
            // progressBar.value = 0;
            // audio.currentTime = 0;
            // audio.play();
        }


        //--------Chuyển bài sau-----------
        nextBtn.onclick = function () {
            var song = qs(`#song-${_this.currentIndex}`);
            song.classList.remove('active');
            if (_this.isShuffle) {
                _this.currentIndex = Math.floor(Math.random() * _this.songs.length);
            }
            else {
                _this.currentIndex++;
                if (_this.currentIndex === _this.songs.length) {
                    _this.currentIndex = 0;
                }
            }
            _this.loadCurrentSong();
            var s = qs(`#song-${_this.currentIndex}`);
            s.classList.add('active');
            // console.log(s);
        };
        //----------Xử lí next song khi audio ended------
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            }
            else {
                nextBtn.click();
            }
        }
        //-------------Lùi bài trước---------
        prevBtn.onclick = function () {
            var song = qs(`#song-${_this.currentIndex}`);
            song.classList.remove('active');
            if (_this.isShuffle) {
                _this.currentIndex = Math.floor(Math.random() * _this.songs.length);
            }
            else {
                _this.currentIndex--;
                if (_this.currentIndex === -1) {
                    _this.currentIndex = _this.songs.length - 1;
                }
            }
            _this.loadCurrentSong();
            var s = qs(`#song-${_this.currentIndex}`);
            s.classList.add('active');
        }
    },



    //-----------Tai bai hat hien tai-------------
    loadCurrentSong: function () {
        const heading = qs('header .name-song');
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
        audio.play();
        // audio.volume = 0;
        console.log(this.currentSong.name, this.currentSong.image, this.currentSong.path);
    },

    start: function () {
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();

        //Lắng nghe/ xử lí các sự kiện (DOM events)
        this.render();

        //Tải thông tin khi chạy ứng dụng
        this.loadCurrentSong();

        //Render playlist
        this.handleEvents();
    }

}
app.start();

// -------------Select song--------------
function selectSong() {
    var songs = qsa('.song');
    songs.forEach(function (song, ind) {
        song.onclick = function () {
            qs('.song.active').classList.remove('active');
            app.currentIndex = ind;
            app.loadCurrentSong();
            // console.log([song]); 
            song.classList.add('active');
        }
    })
}
selectSong();
