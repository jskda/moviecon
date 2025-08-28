const nextConfig = {
  images: {
    domains: [
      'st.kp.yandex.net',
      'via.placeholder.com',
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ← ЭТО ГЛАВНОЕ
  },
}

module.exports = nextConfig