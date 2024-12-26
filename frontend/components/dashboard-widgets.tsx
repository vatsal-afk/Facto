import LokSabhaBills from './widgets/lok-sabha-bills';
import UNConventions from './widgets/un-conventions';
import FakeNewsAlert from './widgets/fake-news-alert';
import SocialMediaUpdates from './widgets/social-media-updates';
import TrendsAndHashtags from './widgets/trends-and-hashtags';
import ImportantArticles from './widgets/important-articles';

export default function DashboardWidgets() {
  return (
    <div className="flex gap-4">
      {/* Left Section: 60% */}
      <div className="flex-1 flex flex-col gap-4">
        <FakeNewsAlert />
        <SocialMediaUpdates />
        <TrendsAndHashtags />
        <ImportantArticles />
      </div>

      {/* Right Section: 40% */}
      <div className="flex-[0.4] flex flex-col gap-4">
        <LokSabhaBills />
        <UNConventions />
      </div>
    </div>
  );
}
