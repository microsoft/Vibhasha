import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Playbook from './Playbook'
import PlaybookIntro from './components/PlaybookIntro'
import './styles.css'

// Docs markdown components
import IntroductionDoc from './components/docs/00-introduction'
import EvaluationOverviewDoc from './components/docs/01-evaluation-overview'
import IMethodologiesDoc from './components/docs/01-i-methodologies'
import IiLowResourceDoc from './components/docs/01-ii-low-resource'
import IiiAdvisoryDoc from './components/docs/01-iii-advisory'
import IvScenariosDoc from './components/docs/01-iv-scenarios'
import VDatasetsDoc from './components/docs/01-v-datasets'
import ViChallengesDoc from './components/docs/01-vi-challenges'
import TranslationOverviewDoc from './components/docs/02-translation-overview'
import IStrategicCrossroadsDoc from './components/docs/02-i-strategic-crossroads'
import IiArchitecturesDoc from './components/docs/02-ii-architectures'
import IiiAdaptationDoc from './components/docs/02-iii-adaptation'
import IvQualityAssuranceDoc from './components/docs/02-iv-quality-assurance'
import VCulturalNuanceDoc from './components/docs/02-v-cultural-nuance'
import ViRecommendationsDoc from './components/docs/02-vi-recommendations'
import FineTuningOverviewDoc from './components/docs/04-fine-tuning-overview'
import IPipelineDoc from './components/docs/04-i-pipeline'
import IiMethodologiesDoc from './components/docs/04-ii-methodologies'
import IiiDataEngineeringDoc from './components/docs/04-iii-data-engineering'
import IvAlignmentDoc from './components/docs/04-iv-alignment'
import VQualityDoc from './components/docs/04-v-quality'
import ViImplementationDoc from './components/docs/04-vi-implementation'
import SafetyOverviewDoc from './components/docs/05-safety-overview'
import IVulnerabilitiesDoc from './components/docs/05-i-vulnerabilities'
import IiBenchmarksDoc from './components/docs/05-ii-benchmarks'
import IiiRedTeamingDoc from './components/docs/05-iii-red-teaming'
import IvToolkitsDoc from './components/docs/05-iv-toolkits'
import SyntheticDataOverviewDoc from './components/docs/06-synthetic-data-overview'
import IApproachesDoc from './components/docs/06-i-approaches'
import IiQualityDoc from './components/docs/06-ii-quality'
import IiiEvaluationDoc from './components/docs/06-iii-evaluation'
import IvCaseStudyDoc from './components/docs/06-iv-case-study'
import VImplementationDoc from './components/docs/06-v-implementation'
import CultureOverviewDoc from './components/docs/07-culture-overview'
import IFrameworksDoc from './components/docs/07-i-frameworks'
import IiDataBenchmarksDoc from './components/docs/07-ii-data-benchmarks'
import IiiModelingDoc from './components/docs/07-iii-modeling'
import IvPromptEngineeringDoc from './components/docs/07-iv-prompt-engineering'
import VEvaluationDoc from './components/docs/07-v-evaluation'
import ViConclusionDoc from './components/docs/07-vi-conclusion'
import ConclusionDoc from './components/docs/99-conclusion'
import PaperslistDoc from './components/docs/paperslist'
import Safety2Doc from './components/docs/safety-2'
import ScratchpadDoc from './components/docs/scratchpad'
import ToDosDoc from './components/docs/ToDos'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* Always wrap content with Playbook layout to show Sidebar */}
          <Route element={<Playbook />}>
            {/* Root shows PlaybookIntro with sidebar */}
            <Route index element={<PlaybookIntro />} />
            <Route path="playbook">
              <Route index element={<PlaybookIntro />} />
              {/* Docs markdown routes */}
            <Route path="00-introduction" element={<IntroductionDoc />} />
            <Route path="01-evaluation-overview" element={<EvaluationOverviewDoc />} />
            <Route path="01-i-methodologies" element={<IMethodologiesDoc />} />
            <Route path="01-ii-low-resource" element={<IiLowResourceDoc />} />
            <Route path="01-iii-advisory" element={<IiiAdvisoryDoc />} />
            <Route path="01-iv-scenarios" element={<IvScenariosDoc />} />
            <Route path="01-v-datasets" element={<VDatasetsDoc />} />
            <Route path="01-vi-challenges" element={<ViChallengesDoc />} />
            <Route path="02-translation-overview" element={<TranslationOverviewDoc />} />
            <Route path="02-i-strategic-crossroads" element={<IStrategicCrossroadsDoc />} />
            <Route path="02-ii-architectures" element={<IiArchitecturesDoc />} />
            <Route path="02-iii-adaptation" element={<IiiAdaptationDoc />} />
            <Route path="02-iv-quality-assurance" element={<IvQualityAssuranceDoc />} />
            <Route path="02-v-cultural-nuance" element={<VCulturalNuanceDoc />} />
            <Route path="02-vi-recommendations" element={<ViRecommendationsDoc />} />
            <Route path="04-fine-tuning-overview" element={<FineTuningOverviewDoc />} />
            <Route path="04-i-pipeline" element={<IPipelineDoc />} />
            <Route path="04-ii-methodologies" element={<IiMethodologiesDoc />} />
            <Route path="04-iii-data-engineering" element={<IiiDataEngineeringDoc />} />
            <Route path="04-iv-alignment" element={<IvAlignmentDoc />} />
            <Route path="04-v-quality" element={<VQualityDoc />} />
            <Route path="04-vi-implementation" element={<ViImplementationDoc />} />
            <Route path="05-safety-overview" element={<SafetyOverviewDoc />} />
            <Route path="05-i-vulnerabilities" element={<IVulnerabilitiesDoc />} />
            <Route path="05-ii-benchmarks" element={<IiBenchmarksDoc />} />
            <Route path="05-iii-red-teaming" element={<IiiRedTeamingDoc />} />
            <Route path="05-iv-toolkits" element={<IvToolkitsDoc />} />
            <Route path="06-synthetic-data-overview" element={<SyntheticDataOverviewDoc />} />
            <Route path="06-i-approaches" element={<IApproachesDoc />} />
            <Route path="06-ii-quality" element={<IiQualityDoc />} />
            <Route path="06-iii-evaluation" element={<IiiEvaluationDoc />} />
            <Route path="06-iv-case-study" element={<IvCaseStudyDoc />} />
            <Route path="06-v-implementation" element={<VImplementationDoc />} />
            <Route path="07-culture-overview" element={<CultureOverviewDoc />} />
            <Route path="07-i-frameworks" element={<IFrameworksDoc />} />
            <Route path="07-ii-data-benchmarks" element={<IiDataBenchmarksDoc />} />
            <Route path="07-iii-modeling" element={<IiiModelingDoc />} />
            <Route path="07-iv-prompt-engineering" element={<IvPromptEngineeringDoc />} />
            <Route path="07-v-evaluation" element={<VEvaluationDoc />} />
            <Route path="07-vi-conclusion" element={<ViConclusionDoc />} />
            <Route path="99-conclusion" element={<ConclusionDoc />} />
            <Route path="paperslist" element={<PaperslistDoc />} />
            <Route path="safety-2" element={<Safety2Doc />} />
            <Route path="scratchpad" element={<ScratchpadDoc />} />
            <Route path="ToDos" element={<ToDosDoc />} />

          </Route>
          </Route>
          </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
