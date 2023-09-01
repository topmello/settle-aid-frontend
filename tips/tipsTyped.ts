export interface Tip {
  description: string;
  content: string;
  link: string;
}

export interface Tips {
  mode?: string;
  type?: Tip[];
  title?: string;
  description?: string;
  tips?: Tips[];
}

export interface TipArray {
  tips: Tips[];
}

const tips: TipArray = {
  tips: [
    {
      title: "Transportation",
      description: "Transportation",
      tips: [
        {
          mode: "Walk",
          type: [
            {
              description: "Pedestrian Etiquette",
              content:
                "Follow pedestrian rules for your safety and the others, such as crossing at designated crosswalks and obeying traffic signals.",
              link: "",
            },
            {
              description: "Navigation Trick",
              content:
                "Melbourne has a grid-like street layout that makes navigation relatively easy. Major streets like Swanston Street and Collins Street are good reference points.",
              link: "https://www.timeout.com/melbourne/things-to-do/ranked-and-rated-the-streets-in-melbournes-hoddle-grid",
            },
            {
              description: "Comfortable Footwear",
              content:
                "Melbourne is a city made for walking, so ensure you're wearing comfortable and supportive footwear.",
              link: "",
            },
            {
              description: "Weather Readiness",
              content:
                "Check the weather in the home screen before heading out. Carry an umbrella, a light rain jacket, and sun protection.",
              link: "",
            },
            {
              description: "Stay Hydrated",
              content:
                "Carry a water bottle, especially during warmer months, to stay hydrated throughout your walk.",
              link: "",
            },
            {
              description: "Safety Awareness",
              content:
                "Stay aware of your surroundings, keep your belongings secure, and exercise caution, especially at night.",
              link: "https://www.studymelbourne.vic.gov.au/living-here/health-safety-and-wellbeing/what-to-do-in-an-emergency",
            },
            {
              description: "Cycling and Pedestrian Lanes",
              content:
                "Be mindful of bike lanes and pedestrian lanes to ensure a safe walking experience.",
              link: "",
            },
            {
              description: "Elevator Etiquette",
              content: "Stand on the left, walk on the right.",
              link: "",
            },
          ],
        },
        {
          mode: "Micromobility Vehicles",
          type: [
            {
              description: "eScooter Rentals",
              content:
                "Consider renting an eScooter from various rental services available in Melbourne to explore the city on two wheels.",
              link: "https://www.melbourne.vic.gov.au/parking-and-transport/Pages/e-scooters.aspx",
            },
            {
              description: "Cycling Infrastructure",
              content:
                "Take advantage of Melbourne's cycling infrastructure, including dedicated bike lanes and paths, for a safer and more enjoyable ride.",
              link: "https://melbournebikeshare.com.au/explore-melbourne/",
            },
            {
              description: "Helmet Requirement",
              content:
                "Remember that wearing a helmet is mandatory when cycling in Melbourne, so make sure to have a properly fitted helmet.",
              link: "",
            },
            {
              description: "Obey Traffic Rules",
              content:
                "Follow all traffic rules and signals while cycling in Melbourne, ensuring your safety and that of pedestrians and motorists.",
              link: "",
            },
            {
              description: "Be Visible",
              content:
                "Wear bright and reflective clothing, especially during low-light conditions, to enhance your visibility to other road users.",
              link: "",
            },
            {
              description: "Lock Your Bike",
              content:
                "When parking your bike, use a sturdy lock to secure it properly and prevent theft.",
              link: "",
            },
            {
              description: "Explore Bike Paths",
              content:
                "Explore dedicated bike paths such as the Capital City Trail and the Yarra River Trail for a scenic and car-free cycling experience.",
              link: "https://www.melbourne.vic.gov.au/parking-and-transport/cycling/Pages/bike-paths.aspx",
            },
            {
              description: "Public Transport and Bikes",
              content:
                "You can take your foldable bike on certain public transport services during off-peak hours. Check the guidelines before traveling.",
              link: "https://www.ptv.vic.gov.au/more/travelling-on-the-network/bikes-on-public-transport/",
            },
            {
              description: "Bike Repair Stations",
              content:
                "Familiarize yourself with the locations of bike repair stations in case you need assistance with minor repairs or adjustments.",
              link: "",
            },
            {
              description: "Respect Pedestrians",
              content:
                "Be respectful of pedestrians on shared paths, give them ample space, and signal when overtaking.",
              link: "",
            },
            {
              description: "Stay Hydrated",
              content:
                "Carry water with you to stay hydrated during your cycling adventures, especially on warmer days.",
              link: "",
            },
            {
              description: "Discover Neighborhoods",
              content:
                "Cycling allows you to easily explore Melbourne's diverse neighborhoods and their unique offerings.",
              link: "",
            },
            {
              description: "Join Cycling Events",
              content:
                "Keep an eye out for cycling events and group rides in Melbourne to connect with fellow cyclists and explore the city together.",
              link: "https://melbournebybike.com/",
            },
          ],
        },
        {
          mode: "Public Transport",
          type: [
            {
              description: "Myki Card",
              content:
                "Get a Myki card, Melbourne's smartcard for public transport. It's essential for accessing trains, trams, and buses.",
              link: "https://www.ptv.vic.gov.au/tickets/myki/",
            },
            {
              description: "Train Schedule",
              content:
                "Monday to Thursday: 5am to midnight; Friday and weekends: full day; Schedule is subject to changes, please refer to official website for updates.",
              link: "https://www.metrotrains.com.au/timetables/?line=Alamein&dir=1&ts=1693361344704",
            },
            {
              description: "Stop Awareness",
              content:
                "Look for the termination stop names instead of only focusing on the route number.",
              link: "",
            },
            {
              description: "Public Transport Zones",
              content:
                "Understand Melbourne's public transport zones to determine fares based on your travel distance.",
              link: "https://www.ptv.vic.gov.au/footer/legal-and-policies/victorian-fares-and-ticketing-manual/",
            },
            {
              description: "Timetables and Routes",
              content:
                "Check public transport timetables and routes in advance using official sources or apps for a smooth journey.",
              link: "https://www.ptv.vic.gov.au/timetables/",
            },
            {
              description: "Touch On and Off",
              content:
                "Always remember to touch on and off with your Myki card to ensure you're charged the correct fare for your journey.",
              link: "",
            },
            {
              description: "Free Tram Zone",
              content:
                "Explore Melbourne's central attractions by tram within the Free Tram Zone without needing a Myki card.",
              link: "https://www.ptv.vic.gov.au/assets/PDFs/Maps/Network-maps/5b4a3efe80/PTV-Free-Tram-Zone-Map.pdf",
            },
            {
              description: "Discounts and Concessions",
              content:
                "Students, seniors, and other eligible individuals can enjoy discounts and concessions on public transport fares.",
              link: "https://www.ptv.vic.gov.au/tickets/myki/concessions-and-free-travel/",
            },
            {
              description: "Cleanliness and Etiquette",
              content:
                "Maintain cleanliness and follow public transport etiquette to ensure a comfortable and respectful journey for everyone.",
              link: "",
            },
            {
              description: "Customer Service",
              content:
                "For assistance or information, contact public transport customer service or visit information centers at major stations.",
              link: "https://www.ptv.vic.gov.au/more/help-and-support/",
            },
            {
              description: "Touching Off in Free Tram Zone",
              content:
                "Even within the Free Tram Zone, you still need to touch on and off trams using your Myki card.",
              link: "",
            },
            {
              description: "Lost Property",
              content:
                "If you lose something on public transport, report it to the authorities and check the lost property collection points.",
              link: "https://www.ptv.vic.gov.au/more/travelling-on-the-network/lost-property/",
            },
            {
              description: "Elevator Etiquette",
              content: "Stand on the left, walk on the right.",
              link: "",
            },
          ],
        },
      ],
    },
    {
      title: "Landmarks",
      description: "Landmarks",
      tips: [
        {
          mode: "Local",
          type: [
            {
              description: "Exploring Alleys and Arcades",
              content:
                "Discover Melbourne's laneways filled with street art, boutiques, and cafes for a unique experience.",
              link: "https://www.visitmelbourne.com/regions/melbourne/destinations/laneways",
            },
            {
              description: "Elevator Etiquette",
              content: "Stand on the left, walk on the right.",
              link: "",
            },
            {
              description: "Walking Tours",
              content:
                "Consider joining a guided walking tour. This can help you learn about the city's history, architecture, and hidden gems from a local guide.",
              link: "https://imfree.com.au/melbourne/",
            },
            {
              description: "Respectful Behavior",
              content:
                "Practice respectful behavior when visiting landmarks. Keep noise levels down, especially in quiet or indoor areas, to ensure a peaceful environment for everyone.",
              link: "",
            },
            {
              description: "Litter-Free Zones",
              content:
                "Keep the surroundings clean by using designated trash bins for disposing of litter. Help maintain the beauty of the landmarks and their surroundings.",
              link: "",
            },
            {
              description: "Photography Etiquette",
              content:
                "When taking photos, be considerate of others. Avoid blocking pathways, respect privacy, and follow any rules regarding photography or videography.",
              link: "",
            },
            {
              description: "Stay on Designated Paths",
              content:
                "Stick to designated pathways and areas to protect sensitive or restricted zones. This helps preserve the landmark's integrity and prevents accidents.",
              link: "",
            },
            {
              description: "Follow Guided Tours",
              content:
                "If participating in guided tours, follow the guide's instructions and respect the schedule. Avoid disrupting the experience for others.",
              link: "",
            },
            {
              description: "Cultural Sensitivity",
              content:
                "Be culturally sensitive when visiting landmarks with historical or cultural significance. Follow guidelines, avoid touching artifacts unless allowed, and ask questions with respect.",
              link: "",
            },
            {
              description: "Respect Wildlife",
              content:
                "If the landmark has natural elements or gardens, respect the wildlife and plants. Avoid feeding animals and stay on designated paths.",
              link: "",
            },
            {
              description: "Crowded Areas",
              content:
                "In crowded areas, be patient and courteous. Allow others to enjoy the view or take photos before moving along.",
              link: "",
            },
            {
              description: "Queue Respectfully",
              content:
                "If there are lines or queues, wait your turn patiently. Maintain personal space and follow the established queueing system.",
              link: "",
            },
            {
              description: "Emergency Preparedness",
              content:
                "Familiarize yourself with emergency exits and safety procedures. In case of an emergency, follow staff instructions and assist others if needed.",
              link: "",
            },
            {
              description: "Feedback and Complaints",
              content:
                "If you have feedback or encounter issues, communicate respectfully with staff. They are there to help and ensure a positive experience for all visitors.",
              link: "",
            },
            {
              description: "Social Media Usage",
              content:
                "When sharing your visit on social media, be mindful of other visitors and the environment. Avoid disruptive behavior for the sake of capturing content.",
              link: "",
            },
            {
              description: "Dress Code",
              content:
                "Check if the landmark has a specific dress code, especially if it's a religious or formal site. Dress appropriately out of respect for the place and its customs.",
              link: "",
            },
            {
              description: "Accessibility Consideration",
              content:
                "Be considerate of individuals with disabilities. Offer assistance if needed and respect accessible facilities and pathways.",
              link: "",
            },
          ],
        },
        {
          mode: "Indian",
          type: [
            {
              description: "Dress Modestly",
              content:
                "In many Indian landmarks, modest dress is appreciated. Avoid wearing revealing clothing and opt for attire that covers shoulders, knees, and cleavage, especially in religious sites.",
              link: "",
            },
            {
              description: "Addressing Titles",
              content:
                "It’s considered respectful to call people older than yourself aunty or uncle.",
              link: "",
            },
            {
              description: "Remove Footwear",
              content:
                "At temples, mosques, and some historical sites, it's customary to remove your footwear before entering. Follow the locals' lead and place your shoes neatly outside designated areas.",
              link: "",
            },
            {
              description: "Signalling for Direction",
              content:
                "Don't use your finger to point, it’s better to use your whole hand or gesture in the direction you are indicating with your face or chin. You may notice Indian’s “pointing” with their chin in a certain direction rather than pointing with a finger.",
              link: "",
            },
            {
              description: "Touching",
              content:
                "Don’t touch or point at anything or anyone with your foot. Feet are seen as dirty by Indians.",
              link: "",
            },
            {
              description: "Payment",
              content:
                "Don’t use their left hand to hand over anything like money in a shop, or to receive any item.",
              link: "",
            },
            {
              description: "Respect Religious Customs",
              content:
                "In religious sites, follow customs such as covering your head, not pointing your feet towards sacred objects, and refraining from public displays of affection.",
              link: "",
            },
            {
              description: "Ask for Permission to Photograph",
              content:
                "Always ask for permission before taking photos of people, especially in rural areas or with religious figures. Some sites may have restrictions on photography.",
              link: "",
            },
            {
              description: "Follow Guided Tours",
              content:
                "In guided tours, listen to your guide's instructions and respect the schedule. They can provide valuable insights into the history and significance of the landmark.",
              link: "",
            },
            {
              description: "Queue Respectfully",
              content:
                "Follow the queueing system and wait your turn patiently, especially in crowded places or ticket counters. Maintain personal space and be courteous.",
              link: "",
            },
            {
              description: "Respect Elders and Authorities",
              content:
                "Indian culture places high value on respecting elders and authority figures. Show deference and use polite language when interacting with locals.",
              link: "",
            },
            {
              description: "Litter-Free Environment",
              content:
                "Help maintain the cleanliness of the surroundings by disposing of trash properly. Avoid littering and use designated bins.",
              link: "",
            },
            {
              description: "Cultural Sensitivity",
              content:
                "Educate yourself about the cultural norms and practices of the region you're visiting. This will help you avoid unintentional disrespect or misunderstandings.",
              link: "",
            },
            {
              description: "Ask for Directions",
              content:
                "If you're unsure about directions, ask locals for help. Indians are generally helpful and willing to guide you to your destination.",
              link: "",
            },
            {
              description: "Public Display of Affection",
              content:
                "Avoid public displays of affection, as they can be seen as disrespectful or inappropriate in many parts of India.",
              link: "",
            },
            {
              description: "Cultural Sites Closure Days",
              content:
                "Be aware of the closure days of certain cultural or religious sites, as they may not be open to visitors on specific days of the week or during festivals.",
              link: "",
            },
            {
              description: "Language Consideration",
              content:
                "While English is widely spoken, learning a few basic phrases in the local language (Hindi or the local regional language) can be appreciated by locals.",
              link: "",
            },
          ],
        },
        {
          mode: "Chinese",
          type: [
            {
              description: "Respect for Elders",
              content:
                "In Chinese culture, showing respect to elders is important. Use polite language, address them properly, and offer deference when appropriate.",
              link: "",
            },
            {
              description: "Address Seniority",
              content:
                "Address the eldest or most senior person first. Address seniority by an honorific title or by the family name plus Mr.",
              link: "",
            },
            {
              description: "Public Behavior",
              content:
                "Maintain modest and polite behavior in public places. Avoid loud conversations, public displays of affection, and any disruptive actions.",
              link: "",
            },
            {
              description: "Personal Distance",
              content:
                "Don't go straight for a hug. Especially when meeting someone for the first time. Do greet others by using a handshake or a nod.",
              link: "",
            },
            {
              description: "Respect for Traditions",
              content:
                "Respect and observe local traditions and customs. When visiting temples or cultural sites, follow dress codes and respect rules related to prayer and meditation.",
              link: "",
            },
            {
              description: "Public Spaces",
              content:
                "Keep public spaces clean and avoid littering. Dispose of trash properly and use designated bins.",
              link: "",
            },
            {
              description: "Photography Etiquette",
              content:
                "Always ask for permission before taking photos of people, especially in rural areas or with religious figures. Some sites may have restrictions on photography.",
              link: "",
            },
            {
              description: "Queue Respectfully",
              content:
                "Follow the queueing system and wait your turn patiently, especially in crowded places or ticket counters. Maintain personal space and be courteous.",
              link: "",
            },
            {
              description: "Punctuality",
              content:
                "If attending an event or meeting, arrive on time. Punctuality is valued in Chinese culture and shows respect for others' time.",
              link: "",
            },
            {
              description: "Cultural Sensitivity",
              content:
                "Educate yourself about the cultural norms and practices of the region you're visiting. This will help you avoid unintentional disrespect or misunderstandings.",
              link: "",
            },
            {
              description: "Bargaining",
              content:
                "In markets or shops without fixed prices, bargaining is common. Bargain respectfully and avoid aggressive or confrontational behavior.",
              link: "",
            },
          ],
        },
      ],
    },
    {
      title: "Dining",
      description: "Dining",
      tips: [
        {
          mode: "Local",
          type: [
            {
              description: "Reservations",
              content:
                "If the restaurant accepts reservations, it's a good idea to make one, especially during peak hours. This helps you secure a table and ensures a smoother experience.",
              link: "",
            },
            {
              description: "Dress Code",
              content:
                "Check if the restaurant has a specific dress code. Some places may require smart casual attire, while others are more relaxed.",
              link: "",
            },
            {
              description: "Arrival Time",
              content:
                "Arrive on time for your reservation or seating. Being punctual shows respect for the restaurant's schedule and allows you to enjoy your meal fully.",
              link: "",
            },
            {
              description: "Waiting Area",
              content:
                "If there's a waiting area, use it if you arrive early. Avoid crowding the entrance, as it may disturb other diners and staff.",
              link: "",
            },
            {
              description: "Seating Etiquette",
              content:
                "Wait to be seated by the host or hostess. If there's no assigned seating, be mindful not to take up more space than necessary.",
              link: "",
            },
            {
              description: "Cell Phone Use",
              content:
                "While in the restaurant, keep your cell phone on silent mode and refrain from loud conversations. If you need to take a call, step outside.",
              link: "",
            },
            {
              description: "Ordering",
              content:
                "Take your time to review the menu, and place your order politely. If you have dietary restrictions or preferences, communicate them clearly.",
              link: "",
            },
            {
              description: "Special Requests",
              content:
                "If you have special requests (allergies, vegetarian options, etc.), inform the staff when ordering. They'll appreciate your consideration in advance.",
              link: "",
            },
            {
              description: "Patience",
              content:
                "Be patient if there's a wait for your food. Good food takes time, and waiting allows you to enjoy a freshly prepared meal.",
              link: "",
            },
            {
              description: "Table Manners",
              content:
                "Use appropriate table manners, such as using utensils properly, chewing with your mouth closed, and not speaking with food in your mouth.",
              link: "",
            },
            {
              description: "Tipping",
              content:
                "Tipping is customary in Melbourne restaurants. Leaving around 10% of the bill as a tip is a way to show appreciation for good service.",
              link: "",
            },
            {
              description: "Engaging with Staff",
              content:
                "Be courteous and engage with the staff politely. A simple 'please' and 'thank you' go a long way in creating a positive dining experience.",
              link: "",
            },
            {
              description: "Volume Levels",
              content:
                "Keep your voice at a moderate level. Avoid loud conversations that might disturb other diners and affect the overall ambiance.",
              link: "",
            },
            {
              description: "Table Sharing",
              content:
                "In some local restaurants, especially communal dining places, you might be seated at a shared table. Respect the space and engage in friendly conversation.",
              link: "",
            },
            {
              description: "Payment Process",
              content:
                "Wait for the staff to bring the bill. Review it for accuracy, and signal when you're ready to pay. Payment methods might include cash, card, or digital wallets.",
              link: "",
            },
          ],
        },
        {
          mode: "Indian",
          type: [
            {
              description: "Reservations",
              content:
                "If the restaurant accepts reservations, it's a good idea to make one, especially during peak hours. This helps you secure a table and ensures a smoother experience.",
              link: "",
            },
            {
              description: "Dress Appropriately",
              content:
                "Choose modest and casual attire when dining at Indian restaurants. Comfortable clothing is ideal for a relaxed dining experience.",
              link: "",
            },
            {
              description: "Utensil Usage",
              content:
                "In many Indian restaurants, you can choose between using cutlery or eating with your hands. If you prefer hands, use the right hand for eating, as the left is considered unclean.",
              link: "",
            },
            {
              description: "Sharing Dishes",
              content:
                "Indian dining often involves sharing dishes with others. You can order a variety of dishes and share the flavors with your fellow diners.",
              link: "",
            },
            {
              description: "Polite Declining",
              content:
                "If offered more food than you can eat, decline politely. You can say 'No, thank you' or 'I'm full' to show appreciation.",
              link: "",
            },
            {
              description: "Understanding the Menu",
              content:
                "If the menu includes unfamiliar dishes, don't hesitate to ask for explanations. The staff will be happy to help you navigate the options.",
              link: "",
            },
            {
              description: "Cuisine Variety",
              content:
                "Indian restaurants in India offer a wider range of regional cuisines due to the diverse culinary traditions. In Australia, you may find a mix of popular Indian dishes from various regions.",
              link: "",
            },
            {
              description: "Spice Level",
              content:
                "Indian food in India is often spicier and more authentic in terms of spice blends. In Australia, dishes may be adjusted to suit local preferences for milder spice levels.",
              link: "",
            },
            {
              description: "Ingredients",
              content:
                "Indian restaurants in India have access to a broader range of traditional ingredients, which can result in more authentic flavors. Australian restaurants might adapt to local ingredient availability.",
              link: "",
            },
            {
              description: "Presentation",
              content:
                "Indian restaurants in Australia often emphasize visually appealing presentation to suit local dining expectations. In India, focus may be more on taste and traditional plating.",
              link: "",
            },
            {
              description: "Portion Sizes",
              content:
                "Portion sizes in Indian restaurants in Australia might be smaller, catering to different eating habits. In India, larger portions are common due to family-style dining.",
              link: "",
            },
            {
              description: "Service Style",
              content:
                "Service in Indian restaurants in Australia tends to be more formal, with attentive staff. In India, especially at local eateries, service can be more casual and relaxed.",
              link: "",
            },
            {
              description: "Ambiance",
              content:
                "Indian restaurants in Australia often create a fusion of modern and traditional ambiance. In India, you might experience a more authentic and diverse range of restaurant settings.",
              link: "",
            },
            {
              description: "Food Labels",
              content:
                "Indian restaurants in Australia may label dishes with spice levels and dietary information. In India, labels might focus on regional or cultural specialties.",
              link: "",
            },
            {
              description: "Cultural Adaptations",
              content:
                "Indian restaurants in Australia might adjust dishes to suit local dietary preferences and cultural norms. In India, you'll find a more unfiltered representation of traditional cuisine.",
              link: "",
            },
            {
              description: "Ordering",
              content:
                "When ordering, consider the preferences of everyone at the table. Ask for recommendations from the staff if you're unfamiliar with the menu.",
              link: "",
            },
            {
              description: "Fusion Offerings",
              content:
                "Indian restaurants in Australia may experiment with fusion cuisine to cater to diverse tastes. In India, fusion dishes might still have strong roots in traditional flavors.",
              link: "",
            },
            {
              description: "Menu Options",
              content:
                "Menus in Indian restaurants in Australia might feature a streamlined selection of popular dishes. In India, menus can be more extensive, reflecting a wider array of options.",
              link: "",
            },
            {
              description: "Serving Styles",
              content:
                "In India, thali-style dining (a platter with various dishes) is common. In Australia, à la carte options are prevalent, allowing diners to customize their orders.",
              link: "",
            },
          ],
        },
        {
          mode: "Chinese",
          type: [
            {
              description: "Reservations",
              content:
                "If the restaurant accepts reservations, it's a good idea to make one, especially during peak hours. This helps you secure a table and ensures a smoother experience.",
              link: "",
            },
            {
              description: "Utensils Offering",
              content:
                "When dining at an Australian Chinese restaurant, you may be served with a knife & fork. You can always ask staffs politely for chopsticks.",
              link: "",
            },
            {
              description: "Chopstick Etiquette",
              content:
                "When using chopsticks, avoid sticking them upright into a bowl of rice, as this resembles a funeral ritual. Place them across the top of your bowl instead.",
              link: "",
            },
            {
              description: "Cuisine Diversity",
              content:
                "Chinese restaurants in China offer a vast array of regional cuisines, reflecting the country's rich culinary heritage. In Australia, you may find a mix of popular Chinese dishes from different regions.",
              link: "",
            },
            {
              description: "Authenticity",
              content:
                "Chinese restaurants in China serve dishes that closely resemble traditional flavors and preparation methods. In Australia, some adaptations might be made to suit local tastes.",
              link: "",
            },
            {
              description: "Ingredient Availability",
              content:
                "Chinese restaurants in China have access to a broader range of local and seasonal ingredients. In Australia, ingredients might be adapted based on availability and local sourcing.",
              link: "",
            },
            {
              description: "Presentation",
              content:
                "Chinese restaurants in Australia often focus on visually appealing presentation for Western dining preferences. In China, emphasis may be more on the taste and cultural symbolism of dishes.",
              link: "",
            },
            {
              description: "Portion Sizes",
              content:
                "Portion sizes in Chinese restaurants in Australia might be slightly larger to cater to local expectations. In China, portion sizes are often more moderate, encouraging communal sharing.",
              link: "",
            },
            {
              description: "Service Style",
              content:
                "Service in Chinese restaurants in Australia can be more formal and attentive, catering to local service standards. In China, service may vary from casual to attentive based on the dining establishment.",
              link: "",
            },
            {
              description: "Ambiance",
              content:
                "Chinese restaurants in Australia may blend modern and traditional décor to suit a multicultural audience. In China, you'll find a more authentic range of restaurant settings.",
              link: "",
            },
            {
              description: "Menu Variety",
              content:
                "Menus in Chinese restaurants in Australia might focus on popular dishes from different regions. In China, menus can be more extensive, offering a wider range of local specialties.",
              link: "",
            },
            {
              description: "Cultural Adaptation",
              content:
                "Chinese restaurants in Australia may modify dishes to align with local dietary preferences and cultural norms. In China, you'll find more unfiltered traditional offerings.",
              link: "",
            },
            {
              description: "Fusion Cuisine",
              content:
                "Chinese restaurants in Australia might experiment with fusion cuisine to cater to diverse tastes. In China, fusion dishes might have subtle influences but still retain authentic flavors.",
              link: "",
            },
            {
              description: "Menu Labels",
              content:
                "Chinese restaurants in Australia may label dishes with spice levels, dietary information, and allergens. In China, labels might focus on regional specialties and ingredients.",
              link: "",
            },
            {
              description: "Serving Styles",
              content:
                "Chinese restaurants in China often embrace family-style dining with communal dishes. In Australia, à la carte options are common, allowing individual orders.",
              link: "",
            },
            {
              description: "Tea Culture",
              content:
                "Chinese restaurants in China may serve tea automatically, reflecting traditional tea culture. In Australia, tea may be served upon request or not as prominently.",
              link: "",
            },
            {
              description: "Bilingual Menus",
              content:
                "Chinese restaurants in Australia may offer bilingual menus for convenience. In China, menus are typically in Chinese, but staff might assist with translations.",
              link: "",
            },
            {
              description: "Water Temperature",
              content:
                "Depending on the type of Chinese Restaurants, you may receive cold water instead of hot water.",
              link: "",
            },
            {
              description: "Noise Levels",
              content:
                "While vibrant conversation is welcomed, maintain a moderate noise level. Avoid loud conversations that might disturb other diners.",
              link: "",
            },
            {
              description: "Waiting for Elders",
              content:
                "In Chinese culture, it's courteous to wait for elders to begin eating before you start your meal. This shows respect for their authority.",
              link: "",
            },
            {
              description: "Polite Declining",
              content:
                "If offered food or drink that you don't want, decline politely. You can use phrases like 'Thank you, I'm full' to show appreciation.",
              link: "",
            },
            {
              description: "Ordering",
              content:
                "When ordering, consider the preferences of everyone at the table. Ask for recommendations from the staff if you're unfamiliar with the menu.",
              link: "",
            },
            {
              description: "Patience",
              content:
                "Chinese cuisine often involves intricate preparation. Be patient if the dishes take a little longer to arrive, as they're likely being freshly cooked.",
              link: "",
            },
            {
              description: "Expressing Appreciation",
              content:
                "After the meal, express your gratitude by saying 'Thank you' or 'Xie xie' (thank you in Mandarin) to the staff or your host.",
              link: "",
            },
            {
              description: "Understanding Menus",
              content:
                "If the menu includes unfamiliar dishes, don't hesitate to ask for explanations. Staff are usually happy to help you navigate the options.",
              link: "",
            },
            {
              description: "Engaging in Conversation",
              content:
                "Engage in light conversation with your dining companions, showing genuine interest in their stories and experiences.",
              link: "",
            },
          ],
        },
      ],
    },
    {
      title: "Outdoor Activities",
      description:
        "Outdoor Activities and Entertainment Tips in Melbourne City",
      tips: [
        {
          mode: "Relaxation",
          type: [
            {
              description: "Royal Botanic Gardens",
              content:
                "Indulge in a peaceful stroll through the Royal Botanic Gardens, enjoying the tranquility of nature.",
              link: "",
            },
            {
              description: "Riverside Cafes",
              content:
                "Savor a leisurely meal at riverside cafes along the Yarra, relishing beautiful views and gentle breezes.",
              link: "",
            },
            {
              description: "Lunch at Federation Square",
              content:
                "Enjoy a relaxed lunch at Federation Square, surrounded by cultural attractions and open spaces.",
              link: "",
            },
            {
              description: "Picnic at Carlton Gardens",
              content:
                "Organize a delightful picnic at Carlton Gardens, soaking in the serene surroundings near the Melbourne Museum.",
              link: "",
            },
            {
              description: "Yarra River Cruise",
              content:
                "Cruise the Yarra River on a serene boat ride, taking in Melbourne's skyline and gentle waters.",
              link: "",
            },
            {
              description: "Eureka Skydeck Sunset",
              content:
                "Experience the breathtaking sunset views from Eureka Skydeck, offering a moment of tranquility.",
              link: "",
            },
            {
              description: "Coffee by St. Kilda Pier",
              content:
                "Relax with a coffee by St. Kilda Pier, enjoying sea views and the iconic pier's charm.",
              link: "",
            },
            {
              description: "Lakeside Reading at Albert Park",
              content:
                "Find a peaceful spot by Albert Park Lake to enjoy reading a book amidst nature's beauty.",
              link: "",
            },
          ],
        },
        {
          mode: "Wellness",
          type: [
            {
              description: "Morning Yoga in Parks",
              content:
                "Participate in morning yoga sessions held in city parks, fostering physical and mental well-being.",
              link: "",
            },
            {
              description: "Nature Walks in Fitzroy Gardens",
              content:
                "Embark on calming nature walks in Fitzroy Gardens, connecting with nature in the heart of the city.",
              link: "",
            },
            {
              description: "Mindful Art Workshops",
              content:
                "Engage in mindful art workshops in outdoor settings, tapping into your creativity and mindfulness.",
              link: "",
            },
            {
              description: "Outdoor Tai Chi",
              content:
                "Practice outdoor Tai Chi in serene spots, promoting relaxation and inner harmony.",
              link: "",
            },
            {
              description: "Wellness Retreats in City Outskirts",
              content:
                "Consider joining wellness retreats in Melbourne's outskirts for holistic rejuvenation and self-care.",
              link: "",
            },
            {
              description: "Gentle Exercise at St. Kilda Beach",
              content:
                "Participate in gentle exercise sessions by St. Kilda Beach, combining fitness and sea views.",
              link: "",
            },
            {
              description: "Guided Meditation in Gardens",
              content:
                "Experience guided meditation sessions in city gardens, promoting mental clarity and relaxation.",
              link: "",
            },
            {
              description: "Outdoor Spa Experience",
              content:
                "Treat yourself to an outdoor spa experience at select city spas, enjoying relaxation and serenity.",
              link: "",
            },
          ],
        },
        {
          mode: "Cultural Enjoyment",
          type: [
            {
              description: "Art Gallery Visits",
              content:
                "Explore art galleries and exhibitions in the city, immersing yourself in Melbourne's cultural scene.",
              link: "",
            },
            {
              description: "Cultural Events at Federation Square",
              content:
                "Attend outdoor cultural events at Federation Square, celebrating art, music, and community.",
              link: "",
            },
            {
              description: "Historical Walking Tours",
              content:
                "Join historical walking tours in the city, learning about Melbourne's rich past in the open air.",
              link: "",
            },
            {
              description: "Open-Air Theatre Performances",
              content:
                "Experience open-air theatre performances at venues like Royal Botanic Gardens, enjoying the arts under the stars.",
              link: "",
            },
            {
              description: "Live Jazz by the River",
              content:
                "Relax by the Yarra River while listening to live jazz performances, enjoying the city's musical offerings.",
              link: "",
            },
            {
              description: "Outdoor Art Installations",
              content:
                "Admire outdoor art installations and sculptures located throughout the city's parks and public spaces.",
              link: "",
            },
            {
              description: "Cruise with Cultural Talks",
              content:
                "Combine a gentle cruise with informative cultural talks, learning about Melbourne's history and landmarks.",
              link: "",
            },
            {
              description: "Laneway Dining Events",
              content:
                "Indulge in pop-up laneway dining events featuring local cuisine, art, and live entertainment.",
              link: "",
            },
          ],
        },
      ],
    },
    {
      title: "Emergency",
      description: "Important Emergency Advice",
      tips: [
        {
          mode: "Emergency Contacts",
          type: [
            {
              description: "Emergency Services",
              content:
                "You should call 000 if you need urgent help from police, fire or ambulance services.",
              link: "",
            },
            {
              description: "Family Contact",
              content:
                "Know the location and contact details of your family members so that they can be contacted by the authority.",
              link: "",
            },
          ],
        },
        {
          mode: "Personal Safety",
          type: [
            {
              description: "Stay Aware",
              content:
                "Be vigilant of your surroundings, especially in crowded areas and public transportation.",
              link: "",
            },
            {
              description: "Travel Companions",
              content:
                "Stay in touch with your travel family and establish home return time in case you get lost.",
              link: "",
            },
          ],
        },
        {
          mode: "Navigational Safety",
          type: [
            {
              description: "Offline Maps",
              content:
                "Download offline maps or have a physical map to navigate in case your phone's GPS fails.",
              link: "",
            },
            {
              description: "Landmarks and Meeting Points",
              content:
                "Identify prominent landmarks and meeting points to aid navigation in unfamiliar areas.",
              link: "",
            },
          ],
        },
        {
          mode: "Health and Medical",
          type: [
            {
              description: "Emergency Medical Services",
              content:
                "Know the nearest medical facilities and clinics in the city center.",
              link: "",
            },
            {
              description: "First Aid Kit",
              content:
                "Carry a basic first aid kit with essentials like bandages, antiseptics, and medications.",
              link: "",
            },
            {
              description: "Allergies or Medical Conditions",
              content:
                "Wear a medical alert bracelet or carry a card with information about allergies or medical conditions.",
              link: "",
            },
          ],
        },
      ],
    },
    {
      title: "Healthcare",
      description:
        "Useful Tips for Locating and Utilizing Pharmacies and Healthcare Services in Melbourne",
      tips: [
        {
          mode: "Pharmacy Services",
          type: [
            {
              description: "Pharmacy Locations",
              content:
                "Identify pharmacies near your accommodation or major landmarks using online maps or apps.",
              link: "",
            },
            {
              description: "Operating Hours",
              content:
                "Check the operating hours of pharmacies, as they might vary during weekdays and weekends.",
              link: "",
            },
            {
              description: "Prescription Refills",
              content:
                "Ensure you have enough prescription medication during your stay and know the process for refills.",
              link: "",
            },
            {
              description: "Translation Assistance",
              content:
                "If needed, have a translation app or phrasebook to communicate your healthcare needs clearly.",
              link: "",
            },
          ],
        },
        {
          mode: "Medical Clinics",
          type: [
            {
              description: "Urgent Care Centers",
              content:
                "Be aware of nearby urgent care centers or medical clinics for non-emergency healthcare needs.",
              link: "",
            },
            {
              description: "Emergency Medical Services",
              content:
                "Know the locations of hospitals and emergency rooms in case of serious medical issues.",
              link: "",
            },
            {
              description: "Health Insurance Information",
              content:
                "Carry your health insurance details and contact information for quick access during medical visits.",
              link: "",
            },
            {
              description: "Appointment Booking",
              content:
                "If visiting a medical clinic, inquire about appointment booking procedures and wait times.",
              link: "",
            },
          ],
        },
        {
          mode: "Healthcare Assistance",
          type: [
            {
              description: "Pharmacist Consultation",
              content:
                "Consult with pharmacists for over-the-counter medication recommendations and health advice.",
              link: "",
            },
            {
              description: "Language Support",
              content:
                "Ask if the pharmacy or healthcare facility offers language support or interpreters if needed.",
              link: "",
            },
          ],
        },
      ],
    },
    {
      title: "Financial Literacy",
      description:
        "Useful Tips for Understanding Financial Aspects in Australia",
      tips: [
        {
          mode: "Currency and Payments",
          type: [
            {
              description: "Australian Dollar (AUD)",
              content:
                "Familiarize yourself with the Australian Dollar (AUD) and its denominations for easy transactions.",
              link: "",
            },
            {
              description: "Cash, Cards and Apps",
              content:
                "Both cash and cards are widely accepted. Use your card for convenience, but carry some cash for smaller purchases. Some stores may accept other forms of paymeent such as weChat pay or AliPay.",
              link: "",
            },
            {
              description: "Foreign Transaction Fees",
              content:
                "Check with your bank or card provider for any foreign transaction fees when using your card abroad.",
              link: "",
            },
            {
              description: "ATM Locations",
              content:
                "Know the locations of ATMs to avoid extra charges by using your bank's network for withdrawals.",
              link: "",
            },
          ],
        },
        {
          mode: "Shopping and Discounts",
          type: [
            {
              description: "Cash Discounts",
              content:
                "Some shops may offer discounts when paying in cash, so inquire about cash payment options.",
              link: "",
            },
            {
              description: "Goods and Services Tax (GST)",
              content:
                "Be aware that Australia has a Goods and Services Tax (GST) on most goods and services, typically included in the displayed price.",
              link: "",
            },
            {
              description: "Tourist Refund Scheme (TRS)",
              content:
                "If eligible, you can claim a refund on the GST paid on items purchased in Australia through the TRS at the airport.",
              link: "",
            },
            {
              description: "Price Comparison",
              content:
                "Compare prices at different stores and online platforms to make informed purchasing decisions.",
              link: "",
            },
          ],
        },
        {
          mode: "Budgeting and Expenses",
          type: [
            {
              description: "Cost of Living",
              content:
                "Research and understand the cost of living in different cities and regions across Australia.",
              link: "",
            },
            {
              description: "Accommodation Costs",
              content:
                "Budget for accommodation costs, which can vary based on location and type of lodging.",
              link: "",
            },
            {
              description: "Public Transportation",
              content:
                "Consider using public transportation to save on commuting expenses in urban areas.",
              link: "",
            },
            {
              description: "Eating Out",
              content:
                "Plan for eating out expenses by exploring a mix of affordable and indulgent dining options.",
              link: "",
            },
          ],
        },
        {
          mode: "Financial Security",
          type: [
            {
              description: "Emergency Funds",
              content:
                "Maintain an emergency fund to cover unexpected expenses or situations during your stay.",
              link: "",
            },
            {
              description: "Secure Digital Transactions",
              content:
                "Practice safe online shopping and banking by using secure websites and protecting your personal information.",
              link: "",
            },
          ],
        },
      ],
    },
    {
      title: "Australian Culture",
      description:
        "Useful Tips to Embrace and Respect Australian Traditions and Cultural Aspects",
      tips: [
        {
          mode: "Greeting and Interaction",
          type: [
            {
              description: "Informal Greetings",
              content:
                "In social settings, Australians often use informal greetings like 'G'day' or 'Hi' followed by a first name.",
              link: "",
            },
            {
              description: "Respect Personal Space",
              content:
                "Australians value personal space; maintain a comfortable distance while conversing and respect others' boundaries.",
              link: "",
            },
            {
              description: "Laid-Back Attitude",
              content:
                "Embrace the relaxed and friendly attitude Australians have in their interactions with others.",
              link: "",
            },
          ],
        },
        {
          mode: "Food and Dining",
          type: [
            {
              description: "Barbecue Culture",
              content:
                "Participate in or enjoy the Australian barbecue culture, where outdoor grilling is a common social activity.",
              link: "",
            },
            {
              description: "Café Culture",
              content:
                "Experience the vibrant café culture in Australia, where coffee and casual dining play a significant role.",
              link: "",
            },
            {
              description: "Try Local Cuisine",
              content:
                "Sample traditional Australian dishes such as meat pies, lamingtons, and Vegemite.",
              link: "",
            },
          ],
        },
        {
          mode: "Outdoors and Lifestyle",
          type: [
            {
              description: "Outdoor Activities",
              content:
                "Engage in outdoor activities like beach outings, hiking, and sports, which are integral to Australian lifestyle.",
              link: "",
            },
            {
              description: "Nature Appreciation",
              content:
                "Show respect for the diverse natural landscapes by following environmental guidelines and preserving wildlife.",
              link: "",
            },
            {
              description: "Sporting Culture",
              content:
                "Join in conversations about sports, particularly cricket, rugby, Australian rules football, and tennis.",
              link: "",
            },
          ],
        },
        {
          mode: "Cultural Diversity",
          type: [
            {
              description: "Indigenous Culture",
              content:
                "Respect the traditions and contributions of Australia's Indigenous peoples.",
              link: "",
            },
            {
              description: "Multicultural Society",
              content:
                "Appreciate Australia's diverse population, marked by various cultures, languages, and ethnicities.",
              link: "",
            },
            {
              description: "Festivals and Celebrations",
              content:
                "Participate in cultural festivals like Lunar New Year, Diwali, and Greek Festival to celebrate diversity.",
              link: "",
            },
          ],
        },
        {
          mode: "Language and Slang",
          type: [
            {
              description: "Australian Slang",
              content:
                "Familiarize yourself with some common Australian slang terms to enhance your communication.",
              link: "",
            },
            {
              description: "Friendly Banter",
              content:
                "Engage in light-hearted banter and humor, as Australians often use friendly teasing in conversations.",
              link: "",
            },
            {
              description: "Clear Communication",
              content:
                "Speak clearly and politely, and listen attentively to understand and be understood effectively.",
              link: "",
            },
          ],
        },
      ],
    },
  ],
};

export default tips;
