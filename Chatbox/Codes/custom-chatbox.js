var AVATARS = [
  'https://raw.githubusercontent.com/binkie-mudd/stream-assets/main/default.png',
  'https://raw.githubusercontent.com/binkie-mudd/stream-assets/main/sub1.png',
  'https://raw.githubusercontent.com/binkie-mudd/stream-assets/main/sub2.png',
  'https://raw.githubusercontent.com/binkie-mudd/stream-assets/main/sub3.png',
  'https://raw.githubusercontent.com/binkie-mudd/stream-assets/main/gifter.png'
];

var userAvatarCache = {};

function getAvatarForUser(username) {
  if (userAvatarCache[username]) return userAvatarCache[username];
  var hash = 0;
  for (var i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  var index = Math.abs(hash) % AVATARS.length;
  userAvatarCache[username] = AVATARS[index];
  return AVATARS[index];
}

function updateAllAvatars() {
  var dpWindows = document.querySelectorAll('.dp-window');
  for (var i = 0; i < dpWindows.length; i++) {
    var dp = dpWindows[i];

    // skip if already has a real avatar
    var existing = dp.querySelector('img');
    if (existing && existing.src.indexOf('githubusercontent') !== -1) continue;

    // get username from the sibling username span
    var wrapper = dp.parentElement;
    var usernameEl = wrapper ? wrapper.querySelector('.username') : null;
    var username = 'viewer';
    if (usernameEl) {
      // remove the .exe suffix to get real username
      username = usernameEl.textContent.replace('.exe', '').trim();
    }

    var avatarUrl = getAvatarForUser(username);
    dp.innerHTML = '<img src="' + avatarUrl + '" style="width:100%;height:100%;display:block;object-fit:cover;image-rendering:pixelated;">';
  }
}

function startObserver() {
  var log = document.getElementById('log');
  if (!log) {
    setTimeout(startObserver, 200);
    return;
  }
  var observer = new MutationObserver(function() {
    setTimeout(updateAllAvatars, 100);
  });
  observer.observe(log, { childList: true, subtree: true });
}

startObserver();
