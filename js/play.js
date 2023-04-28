// 音乐外链网站 http://www.ytmp3.cn/
var div = document.createElement('div');
div.id = 'aplayer';
document.body.appendChild(div);

var ap = new APlayer({
  container: document.getElementById('aplayer'),
  autoplay: false,
  fixed: true,
  listMaxHeight: 90,
  volume: 0.2,
  audio: [
    {
      name: '花火が瞬く夜に',
      artist: '羽肿',
      url: 'https://www.ytmp3.cn/down/54323.mp3',
      cover: 'http://p2.music.126.net/f7Nd9FSzVZMkTPWDW_rnOg==/736672800839982.jpg?param=90y90',
    },
    {
      name: 'Astral Requiem(星际安魂曲)',
      artist: '山下直人',
      url: 'https://www.ytmp3.cn/down/60154.mp3',
      cover: 'http://p1.music.126.net/GSufGB_lYtITm81iqCSw1Q==/109951163448262836.jpg?param=90y90',
    },
    {
      name: '城南花已开',
      artist: '三亩地',
      url: 'https://music.163.com/song/media/outer/url?id=468176711.mp3',
      cover: 'http://p2.music.126.net/i-7ktILRPImJ0NwiH8DABg==/109951162885959979.jpg?param=90y90',
    },
    {
      name: 'cocoon',
      artist: '林ゆうき',
      url: 'https://www.ytmp3.cn/down/49082.mp3',
      cover:
        'http://p2.music.126.net/r1Vhg-fZNktn3-hJ4yXYtQ==/2526677720646150.jpg?param=90y90',
    },
    {
      name: '从你的全世界路过',
      artist: 'UlyseL',
      url: 'https://music.163.com/song/media/outer/url?id=433103084.mp3',
      cover: 'https://p1.music.126.net/O89Ae7dCtDzYFChkeQedWg==/17745018161034403.jpg?param=90y90',
    },
    {
      name: 'Lights Frightened The Captain',
      artist: 'Stars As Lights',
      url: 'https://music.163.com/song/media/outer/url?id=29023826.mp3',
      cover: 'https://p2.music.126.net/R6jXmr_k4-vTU5rlNhXc7A==/6622358534293744.jpg?param=90y90',
    },
    {
      name: 'God knows',
      artist: '平野绫',
      url: 'https://music.163.com/song/media/outer/url?id=27876224.mp3',
      cover: 'http://p1.music.126.net/6wOX7u8h6_HdtxeLxz9AxA==/2022001883517029.jpg?param=90y90',
    }
  ],
});
