import BreakingNewsBanner from '@/components/widgets/breaking-news-banner'
import FakeNewsAlert from '@/components/widgets/fake-news-alert';
import LokSabhaBills from '@/components/widgets/lok-sabha-bills';
import UNConventions from '@/components/widgets/un-conventions';
import TrendsAndHashtags from '@/components/widgets/trends-and-hashtags';
import SocialMediaUpdates from '@/components/widgets/social-media-updates';
import ImportantArticles from '@/components/widgets/important-articles';
import CustomNews from '@/components/widgets/custom-news-input';
import AlertUser from '@/components/widgets/user-alerts';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-grey-100 to-grey-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8 space-y-6">
        <BreakingNewsBanner />
        <FakeNewsAlert />
        <div className="flex items-start gap-4 mt-4">
          <div className="flex-1 space-y-6">
            <CustomNews />
            <img src="/images/fakes.png" alt="Dashboard Image" className="w-full h-auto rounded-md shadow-md" />
            <TrendsAndHashtags />
          </div>
          <div className="flex-1 space-y-6">
            <LokSabhaBills />
            <UNConventions />
            <AlertUser />
            <SocialMediaUpdates />
          </div>
        </div>
        <ImportantArticles />
      </main>
    </div>
  )
}
