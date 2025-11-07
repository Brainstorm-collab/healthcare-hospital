import { Card, CardContent } from '@/components/ui/card'
import { newsArticles } from '@/data/homepage'

const LatestNewsSection = () => {
  return (
    <section className="bg-white py-24" id="news">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Blog & News</p>
          <h2 className="mt-2 text-3xl font-semibold text-midnight">Read Our Latest News</h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsArticles.map(({ title, category, date, author, image }, index) => (
            <Card key={`${title}-${index}`} className="overflow-hidden rounded-3xl border-none bg-[#F7FAFF] shadow-soft transition hover:-translate-y-1 hover:shadow-card">
              <div className="overflow-hidden">
                <img
                  src={image}
                  alt={title}
                  className="h-48 w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.fallbackAttempted) {
                      e.currentTarget.dataset.fallbackAttempted = 'true'
                      const fallbackImages = [
                        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=420&h=280&fit=crop',
                        'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?w=420&h=280&fit=crop',
                        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=420&h=280&fit=crop',
                      ]
                      e.currentTarget.src = fallbackImages[index % fallbackImages.length] || 'https://via.placeholder.com/420?text=News'
                    }
                  }}
                />
              </div>
              <CardContent className="space-y-3 px-6 py-6">
                <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-primary">
                  <span>{category}</span>
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span>{date}</span>
                </div>
                <h3 className="text-lg font-semibold text-midnight">{title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="h-8 w-8 rounded-full bg-primary/10" />
                  <span className="font-medium text-midnight">{author}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LatestNewsSection

