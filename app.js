// 在这里填入你的 Supabase 信息
const supabaseUrl = "https://nlalpfwvreapvkhgeesx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sYWxwZnd2cmVhcHZraGdlZXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3Mzc3NzEsImV4cCI6MjA5MTMxMzc3MX0.EFh9CHMchCXxN3-Kz2cRS_qzbWWVWI8dZ8m2nIk55Bo";

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 登录函数
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    alert('登录失败：' + error.message);
  } else {
    alert('登录成功');
    location.href = 'index.html';
  }
}

// AI 生成按钮逻辑
document.getElementById('generateBtn')?.addEventListener('click', () => {
  const prompt = document.getElementById('prompt').value;
  if (!prompt) {
    alert('请输入创作内容');
    return;
  }
  document.getElementById('result').innerHTML = "生成中...";
});