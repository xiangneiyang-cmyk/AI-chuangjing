// 在这里填入你的 Supabase 信息
const supabaseUrl = "https://nlalpfwvreapvkhgeesx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sYWxwZnd2cmVhcHZraGdlZXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3Mzc3NzEsImV4cCI6MjA5MTMxMzc3MX0.EFh9CHMchCXxN3-Kz2cRS_qzbWWVWI8dZ8m2nIk55Bo";

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ==========================================
// 登录功能
// ==========================================
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) {
    alert("请输入邮箱和密码");
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    alert("登录失败：" + error.message);
  } else {
    alert("登录成功！");
    location.href = "index.html";
  }
}

// ==========================================
// 注册功能
// ==========================================
async function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) {
    alert("请输入邮箱和密码");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  });

  if (error) {
    alert("注册失败：" + error.message);
  } else {
    alert("注册成功！请查收邮箱验证");
  }
}

// ==========================================
// 退出登录
// ==========================================
async function logout() {
  await supabase.auth.signOut();
  alert("已退出登录");
  location.href = "login.html";
}

// ==========================================
// 获取当前登录用户
// ==========================================
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ==========================================
// AI 生成图片（真能用！免费接口）
// ==========================================
async function generateImage() {
  const prompt = document.getElementById("prompt").value.trim();
  const resultBox = document.getElementById("result");

  if (!prompt) {
    alert("请输入创作提示词！");
    return;
  }

  resultBox.innerHTML = `<div class="text-xl"><i class="fa fa-spinner fa-spin mr-2"></i>正在生成中...</div>`;

  try {
    // 修复：JSON.stringify 正确写法
    const res = await fetch("https://api.156api.com/ai/draw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt })
    });

    const data = await res.json();
    const imgUrl = data.imageUrl;

    resultBox.innerHTML = `<img src="${imgUrl}" class="w-full rounded-lg shadow-xl">`;

    // 保存作品到数据库
    const user = await getCurrentUser();
    if (user) {
      await supabase.from("works").insert([
        {
          user_id: user.id,
          title: prompt.substring(0, 20),
          image_url: imgUrl,
          prompt: prompt
        }
      ]);
    }

    setTimeout(() => {
      loadWorks();
    }, 1000);

  } catch (e) {
    resultBox.innerHTML = "<div class='text-red-400'>生成失败，请重试</div>";
    console.error(e);
  }
}

// ==========================================
// 加载所有作品（首页展示）
// ==========================================
async function loadWorks() {
  const { data, error } = await supabase
    .from("works")
    .select("*")
    .order("created_at", { ascending: false });

  const grid = document.getElementById("workGrid");
  if (!grid) return;

  if (data && data.length > 0) {
    grid.innerHTML = data.map(work => `
      <div class="rounded-xl overflow-hidden glass hover:scale-105 transition">
        <img src="${work.image_url}" class="w-full aspect-[3/4] object-cover">
        <div class="p-3 flex justify-between items-center">
          <p class="text-sm">${work.title}</p>
          <div class="flex gap-2">
            <i class="fa fa-heart text-purple-400"></i>
            <i class="fa fa-comment text-gray-400"></i>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// ==========================================
// 页面加载时执行
// ==========================================
window.onload = function () {
  loadWorks();
};