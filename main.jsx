import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Playbook from './Playbook'
import PlaybookIntro from './components/PlaybookIntro'
import './styles.css'
import { UIProvider } from './theme/UIContext'
import pkg from './package.json'
import { initTelemetry } from './lib/telemetry'

initTelemetry((pkg?.name ?? 'vibhasha').toLowerCase())

// Docs markdown components
import IntroductionDoc from './components/docs/00-introduction'
import EvaluationDoc from './components/docs/01-evaluation'
import IMethodologiesDoc from './components/docs/01-i-methodologies'
import IiPipelineDoc from './components/docs/01-ii-pipeline'
import IiiLowResourceDoc from './components/docs/01-iii-low-resource'
import IvAdvisoryDoc from './components/docs/01-iv-advisory'
import VScenariosDoc from './components/docs/01-v-scenarios'
import ViDatasetsDoc from './components/docs/01-vi-datasets'
import ViiChallengesDoc from './components/docs/01-vii-challenges'
import TranslationDoc from './components/docs/02-translation'
import IStrategicCrossroadsDoc from './components/docs/02-i-strategic-crossroads'
import IiArchitecturesDoc from './components/docs/02-ii-architectures'
import IiiAdaptationDoc from './components/docs/02-iii-adaptation'
import IvQualityAssuranceDoc from './components/docs/02-iv-quality-assurance'
import VCulturalNuanceDoc from './components/docs/02-v-cultural-nuance'
import ViRecommendationsDoc from './components/docs/02-vi-recommendations'
import PromptingDoc from './components/docs/03-prompting'
import IStrategiesDoc from './components/docs/03-i-strategies'
import IiModelSelectionDoc from './components/docs/03-ii-model-selection'
import IiiFewShotDoc from './components/docs/03-iii-few-shot'
import IvEvaluationDoc from './components/docs/03-iv-evaluation'
import FineTuningDoc from './components/docs/04-fine-tuning'
import IPipelineDoc from './components/docs/04-i-pipeline'
import IiMethodologiesDoc from './components/docs/04-ii-methodologies'
import IiiDataEngineeringDoc from './components/docs/04-iii-data-engineering'
import IvAlignmentDoc from './components/docs/04-iv-alignment'
import VQualityDoc from './components/docs/04-v-quality'
import ViImplementationDoc from './components/docs/04-vi-implementation'
import SafetyDoc from './components/docs/05-safety'
import IVulnerabilitiesDoc from './components/docs/05-i-vulnerabilities'
import IiBenchmarksDoc from './components/docs/05-ii-benchmarks'
import IiiRedTeamingDoc from './components/docs/05-iii-red-teaming'
import IvToolkitsDoc from './components/docs/05-iv-toolkits'
import SyntheticDataDoc from './components/docs/06-synthetic-data'
import IApproachesDoc from './components/docs/06-i-approaches'
import IiQualityDoc from './components/docs/06-ii-quality'
import IiiEvaluationDoc from './components/docs/06-iii-evaluation'
import IvCaseStudyDoc from './components/docs/06-iv-case-study'
import VImplementationDoc from './components/docs/06-v-implementation'
import CultureDoc from './components/docs/07-culture'
import IFrameworksDoc from './components/docs/07-i-frameworks'
import IiDataBenchmarksDoc from './components/docs/07-ii-data-benchmarks'
import IiiModelingDoc from './components/docs/07-iii-modeling'
import IvPromptEngineeringDoc from './components/docs/07-iv-prompt-engineering'
import VEvaluationDoc from './components/docs/07-v-evaluation'
import ViConclusionDoc from './components/docs/07-vi-conclusion'
import ConclusionDoc from './components/docs/99-conclusion'
import FlowchartPage from './components/FlowchartPage'
import AttributionDoc from './components/docs/100-attribution';
import ViiPipelineDoc from './components/docs/01-vii-pipeline';
import LandingpageDoc from './components/docs/landingpage';

// Match Vite's base path so React Router works under any GitHub Pages prefix
// ('/Vibhasha/' under GITHUB_ACTIONS, '/' locally).
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UIProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route element={<Playbook />}>
              <Route index element={<PlaybookIntro />} />
              <Route path="playbook">
                <Route index element={<PlaybookIntro />} />
                {/* Docs markdown routes */}
                <Route path="/playbook/00-introduction" element={<IntroductionDoc />} />
                <Route path="/playbook/01-evaluation" element={<EvaluationDoc />} />
                <Route path="/playbook/01-i-methodologies" element={<IMethodologiesDoc />} />
                <Route path="/playbook/01-ii-pipeline" element={<IiPipelineDoc />} />
                <Route path="/playbook/01-iii-low-resource" element={<IiiLowResourceDoc />} />
                <Route path="/playbook/01-iv-advisory" element={<IvAdvisoryDoc />} />
                <Route path="/playbook/01-v-scenarios" element={<VScenariosDoc />} />
                <Route path="/playbook/01-vi-datasets" element={<ViDatasetsDoc />} />
                <Route path="/playbook/01-vii-challenges" element={<ViiChallengesDoc />} />
                <Route path="/playbook/02-translation" element={<TranslationDoc />} />
                <Route path="/playbook/02-i-strategic-crossroads" element={<IStrategicCrossroadsDoc />} />
                <Route path="/playbook/02-ii-architectures" element={<IiArchitecturesDoc />} />
                <Route path="/playbook/02-iii-adaptation" element={<IiiAdaptationDoc />} />
                <Route path="/playbook/02-iv-quality-assurance" element={<IvQualityAssuranceDoc />} />
                <Route path="/playbook/02-v-cultural-nuance" element={<VCulturalNuanceDoc />} />
                <Route path="/playbook/02-vi-recommendations" element={<ViRecommendationsDoc />} />
                <Route path="/playbook/03-prompting" element={<PromptingDoc />} />
                <Route path="/playbook/03-i-strategies" element={<IStrategiesDoc />} />
                <Route path="/playbook/03-ii-model-selection" element={<IiModelSelectionDoc />} />
                <Route path="/playbook/03-iii-few-shot" element={<IiiFewShotDoc />} />
                <Route path="/playbook/03-iv-evaluation" element={<IvEvaluationDoc />} />
                <Route path="/playbook/04-fine-tuning" element={<FineTuningDoc />} />
                <Route path="/playbook/04-i-pipeline" element={<IPipelineDoc />} />
                <Route path="/playbook/04-ii-methodologies" element={<IiMethodologiesDoc />} />
                <Route path="/playbook/04-iii-data-engineering" element={<IiiDataEngineeringDoc />} />
                <Route path="/playbook/04-iv-alignment" element={<IvAlignmentDoc />} />
                <Route path="/playbook/04-v-quality" element={<VQualityDoc />} />
                <Route path="/playbook/04-vi-implementation" element={<ViImplementationDoc />} />
                <Route path="/playbook/05-safety" element={<SafetyDoc />} />
                <Route path="/playbook/05-i-vulnerabilities" element={<IVulnerabilitiesDoc />} />
                <Route path="/playbook/05-ii-benchmarks" element={<IiBenchmarksDoc />} />
                <Route path="/playbook/05-iii-red-teaming" element={<IiiRedTeamingDoc />} />
                <Route path="/playbook/05-iv-toolkits" element={<IvToolkitsDoc />} />
                <Route path="/playbook/06-synthetic-data" element={<SyntheticDataDoc />} />
                <Route path="/playbook/06-i-approaches" element={<IApproachesDoc />} />
                <Route path="/playbook/06-ii-quality" element={<IiQualityDoc />} />
                <Route path="/playbook/06-iii-evaluation" element={<IiiEvaluationDoc />} />
                <Route path="/playbook/06-iv-case-study" element={<IvCaseStudyDoc />} />
                <Route path="/playbook/06-v-implementation" element={<VImplementationDoc />} />
                <Route path="/playbook/07-culture" element={<CultureDoc />} />
                <Route path="/playbook/07-i-frameworks" element={<IFrameworksDoc />} />
                <Route path="/playbook/07-ii-data-benchmarks" element={<IiDataBenchmarksDoc />} />
                <Route path="/playbook/07-iii-modeling" element={<IiiModelingDoc />} />
                <Route path="/playbook/07-iv-prompt-engineering" element={<IvPromptEngineeringDoc />} />
                <Route path="/playbook/07-v-evaluation" element={<VEvaluationDoc />} />
                <Route path="/playbook/07-vi-conclusion" element={<ViConclusionDoc />} />
                <Route path="/playbook/99-conclusion" element={<ConclusionDoc />} />
                <Route path="/playbook/flowchart" element={<FlowchartPage />} />
                <Route path="/playbook/100-attribution" element={<AttributionDoc />} />
        <Route path="/playbook/01-vii-pipeline" element={<ViiPipelineDoc />} />
        <Route path="/playbook/landingpage" element={<LandingpageDoc />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </UIProvider>
  </React.StrictMode>
);
