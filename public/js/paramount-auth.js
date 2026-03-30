/**
 * Demo client-side auth for Paramount World Records.
 * For production, replace with Supabase Auth, Firebase, or your own API + database.
 */
(function () {
	var USERS_KEY = "paramount_users_v1";
	var SESSION_KEY = "paramount_session";

	function bytesToHex(buf) {
		return Array.from(new Uint8Array(buf))
			.map(function (b) {
				return b.toString(16).padStart(2, "0");
			})
			.join("");
	}

	function randomSalt() {
		var a = new Uint8Array(16);
		crypto.getRandomValues(a);
		return bytesToHex(a.buffer);
	}

	async function hashPassword(password, salt) {
		var enc = new TextEncoder();
		var data = enc.encode(password + salt);
		var digest = await crypto.subtle.digest("SHA-256", data);
		return bytesToHex(digest);
	}

	function getUsers() {
		try {
			return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
		} catch (e) {
			return [];
		}
	}

	function saveUsers(users) {
		localStorage.setItem(USERS_KEY, JSON.stringify(users));
	}

	async function registerUser(payload) {
		var users = getUsers();
		var uname = (payload.username || "").trim().toLowerCase();
		if (!uname) throw new Error("Username is required.");
		if (users.some(function (u) { return u.usernameLower === uname; })) {
			throw new Error("That username is already taken.");
		}
		var salt = randomSalt();
		var passHash = await hashPassword(payload.password, salt);
		users.push({
			username: payload.username.trim(),
			usernameLower: uname,
			name: payload.name.trim(),
			age: payload.age,
			gender: payload.gender,
			email: payload.email.trim(),
			phone: payload.phone.trim(),
			address: payload.address.trim(),
			salt: salt,
			passHash: passHash,
			createdAt: new Date().toISOString()
		});
		saveUsers(users);
		return users[users.length - 1];
	}

	async function verifyLogin(username, password) {
		var uname = (username || "").trim().toLowerCase();
		var users = getUsers();
		var u = users.find(function (x) { return x.usernameLower === uname; });
		if (!u) throw new Error("Invalid username or password.");
		var h = await hashPassword(password, u.salt);
		if (h !== u.passHash) throw new Error("Invalid username or password.");
		return u;
	}

	function setSession(user) {
		sessionStorage.setItem(
			SESSION_KEY,
			JSON.stringify({
				username: user.username,
				name: user.name
			})
		);
	}

	function getSession() {
		try {
			var s = sessionStorage.getItem(SESSION_KEY);
			return s ? JSON.parse(s) : null;
		} catch (e) {
			return null;
		}
	}

	function clearSession() {
		sessionStorage.removeItem(SESSION_KEY);
	}

	function newMathCaptcha() {
		var a = Math.floor(Math.random() * 9) + 1;
		var b = Math.floor(Math.random() * 9) + 1;
		return { a: a, b: b, answer: a + b };
	}

	function updateNav() {
		var guest = document.getElementById("authNavGuest");
		var user = document.getElementById("authNavUser");
		var nameEl = document.getElementById("authDisplayName");
		var btn = document.getElementById("authLogoutBtn");
		if (!guest || !user) return;

		var sess = getSession();
		if (sess) {
			guest.hidden = true;
			user.hidden = false;
			if (nameEl) nameEl.textContent = sess.name || sess.username || "";
		} else {
			guest.hidden = false;
			user.hidden = true;
		}

		if (btn && !btn.dataset.bound) {
			btn.dataset.bound = "1";
			btn.addEventListener("click", function () {
				clearSession();
				updateNav();
				if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
					window.location.href = "/home";
				}
			});
		}
	}

	window.ParamountAuth = {
		USERS_KEY: USERS_KEY,
		SESSION_KEY: SESSION_KEY,
		getUsers: getUsers,
		registerUser: registerUser,
		verifyLogin: verifyLogin,
		setSession: setSession,
		getSession: getSession,
		clearSession: clearSession,
		hashPassword: hashPassword,
		newMathCaptcha: newMathCaptcha,
		updateNav: updateNav
	};

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", updateNav);
	} else {
		updateNav();
	}
})();
