import Link from 'next/link'
import { Film, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Film className="h-6 w-6 text-red-600" />
            <span className="text-lg font-bold">MovieCon</span>
          </div>
          
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link href="/about" className="hover:text-red-500 transition-colors">
              О нас
            </Link>
            <Link href="/contact" className="hover:text-red-500 transition-colors">
              Контакты
            </Link>
            <Link href="/privacy" className="hover:text-red-500 transition-colors">
              Политика
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-400">
            <span>Сделано с</span>
            <Heart className="h-4 w-4 text-red-600" />
            <span>для киноманов</span>
          </div>
        </div>
        
        <div className="text-center text-gray-400 mt-6">
          <p>© 2024 MovieCon. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}