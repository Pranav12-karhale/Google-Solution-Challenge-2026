export const DISRUPTION_PLAYBOOK = `
SECTION 1 — GEOPOLITICAL & TRADE DISRUPTIONS

1.1 Wars and Military Conflicts
Disruption: Active wars or military operations block ports, destroy infrastructure, halt factory output.
Solution: Build a geopolitical risk scoring system. Every supplier is tagged with a country-risk score. If a supplier's country risk score crosses a defined threshold, automatically flag and activate a pre-approved alternate supplier from a different geopolitical zone. Maintain at minimum one backup supplier per critical input from a politically neutral country.

1.2 Trade Wars and Tariffs
Disruption: Governments impose sudden import/export tariffs making contracts unprofitable.
Solution: Integrate a live tariff-monitoring API. When tariff changes are detected, automatically re-run landed cost calculations across all active supplier options and recommend the most cost-effective compliant route. Use tariff fluctuation clauses.

1.3 Sanctions and Embargoes
Disruption: A country/entity becomes sanctioned, making transactions illegal.
Solution: Implement an automated sanctions screening layer. Flag and block any transaction involving a newly sanctioned entity and auto-escalate to compliance review.

1.4 Border Disputes and Territorial Conflicts
Disruption: Disputed borders result in sudden road closures or rerouting.
Solution: Model every route with a primary path and at least one alternative path that bypasses disputed zones. Freight contracts must specify rerouting rights.

1.5 Political Instability and Government Changes
Disruption: Elections, coups, or policy reversals change regulations overnight.
Solution: Build a country-exit contingency plan. Define trigger conditions (civil unrest index) and activate a pre-approved alternate supplier.

SECTION 2 — NATURAL AND CLIMATE DISRUPTIONS

2.1 Earthquakes, Floods, and Hurricanes
Disruption: Natural disasters destroy infrastructure with zero warning.
Solution: Require business interruption insurance. Maintain a 45 to 90 day strategic stock buffer for single-source critical components in a geographically distributed warehouse network.

2.2 Droughts and Wildfires
Disruption: Prolonged droughts affect raw materials and hydroelectric power.
Solution: Source agricultural inputs from at least two climatically diverse regions. Require manufacturing suppliers to disclose energy source diversity.

2.3 Pandemics and Disease Outbreaks
Disruption: A pandemic shuts factories, borders, and ports simultaneously.
Solution: Geographic diversification (no country > 40%), supplier redundancy (2+ suppliers per component), and a rapid response playbook activated within 72 hours.

2.4 Extreme Weather Events
Disruption: Heat waves or snowstorms disrupt transport and close warehouses.
Solution: Build weather-trigger alerts. Assess impact on in-transit shipments, trigger rerouting options, and send proactive customer delay notifications.

2.5 Long-Term Climate Shift and Sea Level Rise
Disruption: Climate change makes certain manufacturing regions unviable.
Solution: Integrate a climate risk horizon scoring model. High-risk sites trigger a transition plan to relocate.

SECTION 3 — TRANSPORT AND LOGISTICS DISRUPTIONS

3.1 Port Congestion
Disruption: Too many ships overwhelm port capacity.
Solution: Negotiate slot-booking agreements with freight forwarders. Distribute import volumes across multiple ports. Reroute shipments to less congested ports.

3.2 Canal and Route Blockages
Disruption: A single blocked canal halts global trade.
Solution: For high-risk chokepoints (Suez, Panama), carry a pre-planned alternative routing. Trigger a decision prompt: reroute now or hold and wait with a maximum threshold.

3.3 Trucker and Driver Shortages
Disruption: Insufficient truck drivers cause port pile-ups.
Solution: Diversify last-mile logistics across at least three carriers per region. Establish advance rate agreements.

3.4 Airline Cargo Restrictions and Capacity Limits
Disruption: Air freight rates spike during passenger flight reductions.
Solution: Develop a sea-air hybrid routing option as a standing backup. Identify freighter-only airlines.

3.5 Rail and Road Infrastructure Failures
Disruption: Bridge collapses or landslides cut off inland corridors.
Solution: Map every inland route with its known vulnerability points. Pre-identify a bypass route with associated time and cost.

3.6 Fuel Price Spikes
Disruption: Sudden oil price surges inflate freight costs.
Solution: Include fuel surcharge clauses. Hedge fuel costs. Prioritize nearshoring.

SECTION 4 — ECONOMIC AND FINANCIAL DISRUPTIONS

4.1 Currency Volatility
Disruption: Sudden devaluation of currency makes contracts unreliable.
Solution: Include currency clauses defining tolerance bands (e.g. ±5%). Use forward contracts for hedging.

4.2 Credit Freezes and Payment Failures
Disruption: Banks restrict credit, suppliers cannot access working capital.
Solution: Establish supply chain financing (SCF) facilities allowing suppliers to access early payment at Antigravity's credit rating.

4.3 Supplier Bankruptcy
Disruption: A supplier collapses suddenly.
Solution: Implement a supplier financial health scorecard. When a supplier enters the watch list, activate alternative supplier qualification before crisis.

4.4 Inflation and Input Cost Surges
Disruption: Inflation makes contracted prices unsustainable.
Solution: Use inflation indexing clauses tied to recognized indices (CPI, PPI).

4.5 Demand Shocks and Over-Concentration
Disruption: Over-reliance on a single country/source creates catastrophic exposure.
Solution: No single country should represent more than 50% of sourcing. Gradually build alternate relationships in India, LATAM, etc.

SECTION 5 — CYBER AND TECHNOLOGY DISRUPTIONS

5.1 Ransomware and Cyberattacks
Disruption: Hackers encrypt systems, halting operations.
Solution: Require Tier 1 suppliers to comply with cybersecurity standards (MFA, backups). Isolate backup environments.

5.2 IT and ERP System Failures
Disruption: Software bugs freeze purchasing and tracking.
Solution: Design systems with graceful degradation and manual fallback procedures.

5.3 Data Breaches and IP Theft
Disruption: Theft of product designs or pricing data.
Solution: Classify data by sensitivity. Use encrypted portals.

5.4 AI and Automation Errors
Disruption: AI causes system-wide over-ordering or misrouting.
Solution: Require human review gates for decisions above a value threshold.

5.5 Semiconductor and Chip Shortages
Disruption: Concentrated fab manufacturing causes cascading shortages.
Solution: Implement 60 to 120 day buffer for critical components. Qualify multiple suppliers. Design flexible components.

SECTION 6 — LABOUR AND HUMAN FACTOR DISRUPTIONS

6.1 Strikes and Industrial Walkouts
Disruption: Labour disputes halt supply chains.
Solution: Assess supplier labour relations. High-risk periods trigger pre-emptive stock build.

6.2 Skilled Labour Shortages
Disruption: Inability to hire slows production.
Solution: Automate repetitive tasks to reduce headcount dependency.

6.3 Mass Absenteeism
Disruption: Outbreaks or extreme heat pull workforce away.
Solution: Cross-train workforces to absorb 30% absenteeism. Establish remote-work capabilities.

6.4 Migration and Brain Drain
Disruption: Economic migration degrades supplier capability.
Solution: Track workforce retention metrics. Poor retention triggers alternate supplier qualification.

6.5 Workplace Accidents and Safety Closures
Disruption: Factory accident triggers government closure.
Solution: Mandate safety standards. Add safety closure clauses to activate force-majeure stock release.

SECTION 7 — REGULATORY AND POLICY DISRUPTIONS

7.1 Sudden Export Bans
Disruption: Government bans export of critical commodity.
Solution: Maintain commodity-watch list. Hold 60-90 day domestic buffer.

7.2 Customs Delays and Inspection Bottlenecks
Disruption: Increased inspections hold shipments.
Solution: Pre-validate documentation. Pursue Authorised Economic Operator (AEO) status.

7.3 Licensing and Certification Changes
Disruption: New regulations require re-certification.
Solution: Track regulations. Less than 6 months lead time triggers a contingency stock build.

7.4 ESG and Sustainability Compliance
Disruption: New ESG rules require deep supply chain mapping.
Solution: Map supply chain to Tier 3. Embed ESG compliance in contracts.

7.5 Food Safety and Product Recall Mandates
Disruption: Regulator mandates recall.
Solution: Implement full traceability and lot-numbering. Identify affected lots within 2 hours.

SECTION 8 — DEMAND AND INVENTORY DISRUPTIONS

8.1 The Bullwhip Effect
Disruption: Small demand changes amplify into massive order swings.
Solution: Implement collaborative demand planning. Share real POS data with suppliers. Cap order fluctuations.

8.2 Panic Buying and Consumer Hoarding
Disruption: Crisis triggers rapid out-of-stocks.
Solution: Implement purchase quantity limits. Auto-trigger supply acceleration workflow.

8.3 Just-in-Time Manufacturing Failure
Disruption: JIT provides zero buffer during node failures.
Solution: Shift to hybrid JIT. Strategic safety stock for high-risk items; JIT for stable items.

8.4 Demand Forecast Errors
Disruption: Inaccurate forecasts lead to over/under stock.
Solution: Use statistical forecasting with multiple inputs and scenario planning.

8.5 Sudden Consumer Trend Shifts
Disruption: Viral moments shift demand instantly.
Solution: Build demand sensing via social/search trends. Trigger small-batch pilot responses.

SECTION 9 — SMALL TRIGGERS WITH LARGE CASCADE EFFECTS

Single Factory Fire -> Qualify secondary supplier before failure.
Single Ship Aground -> Hold safety stock to cover maximum chokepoint closure (e.g., 14 days).
One Port Worker COVID Cluster -> Distribute freight across multiple ports.
Packaging Machine Failure -> Hold 30 days packaging inventory.
Regulatory Chemical Change -> Pre-approve substitute materials.
Single IT Hack -> Contract at least two logistics providers per lane.

SECTION 10 — STRUCTURAL FRAGILITY: ROOT CAUSES

10.1 Just-in-Time Obsession -> Adopt tiered inventory policy (buffers for high-risk).
10.2 Geographic Concentration -> Maximum concentration rule (<40% per country).
10.3 Hyper-Specialization -> Qualify second source for all single-source items.
10.4 Opacity -> Map sub-tier suppliers annually.
10.5 Supplier Financial Fragility -> Offer supply chain financing to strategic suppliers.
`;
