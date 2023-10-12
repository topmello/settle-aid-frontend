import { TouchableOpacity } from "react-native";
import { Image } from "react-native";

const getTipImage = (photo: string) => {
  switch (photo) {
    case "pedestrian_etiquette.png":
      return require("../assets/images/tip/pedestrian_etiquette.png");
    case "navigation_trick.png":
      return require("../assets/images/tip/navigation_trick.png");
    case "comfortable_footwear.png":
      return require("../assets/images/tip/comfortable_footwear.png");
    case "weather_readiness.png":
      return require("../assets/images/tip/weather_readiness.png");
    case "stay_hydrated.png":
      return require("../assets/images/tip/stay_hydrated.png");
    case "safety_awareness.png":
      return require("../assets/images/tip/safety_awareness.png");
    case "cycling_lanes.png":
      return require("../assets/images/tip/cycling_lanes.png");
    case "escalator_etiquette.png":
      return require("../assets/images/tip/escalator_etiquette.png");
    case "escooter_rental.png":
      return require("../assets/images/tip/escooter_rental.png");
    case "cycling_infrastructure.png":
      return require("../assets/images/tip/cycling_infrastructure.png");
    case "helmet_required.png":
      return require("../assets/images/tip/helmet_required.png");
    case "obey_traffic.png":
      return require("../assets/images/tip/obey_traffic.png");
    case "be_visible.png":
      return require("../assets/images/tip/be_visible.png");
    case "lock_bike.png":
      return require("../assets/images/tip/lock_bike.png");
    case "explore_path.png":
      return require("../assets/images/tip/explore_path.png");
    case "cycling_infrastructure.png":
      return require("../assets/images/tip/cycling_infrastructure.png");
    case "offline_map.png":
      return require("../assets/images/tip/offline_map.png");
    case "pedestrian_etiquette.png":
      return require("../assets/images/tip/pedestrian_etiquette.png");
    case "stay_hydrated.png":
      return require("../assets/images/tip/stay_hydrated.png");
    case "cycling_infrastructure.png":
      return require("../assets/images/tip/cycling_infrastructure.png");
    case "cycling_infrastructure.png":
      return require("../assets/images/tip/cycling_infrastructure.png");
    case "myki.png":
      return require("../assets/images/tip/myki.png");
    case "train_schedule.png":
      return require("../assets/images/tip/train_schedule.png");
    case "stop_awareness.png":
      return require("../assets/images/tip/stop_awareness.png");
    case "public_transport_zone.png":
      return require("../assets/images/tip/public_transport_zone.png");
    case "train_schedule.png":
      return require("../assets/images/tip/train_schedule.png");
    case "myki_touch.png":
      return require("../assets/images/tip/myki_touch.png");
    case "free_tram_zone.png":
      return require("../assets/images/tip/free_tram_zone.png");
    case "cash_disc.png":
      return require("../assets/images/tip/cash_disc.png");
    case "authenticity.png":
      return require("../assets/images/tip/authenticity.png");
    case "understand_menu.png":
      return require("../assets/images/tip/understand_menu.png");
    case "myki_touch.png":
      return require("../assets/images/tip/myki_touch.png");
    case "understand_menu.png":
      return require("../assets/images/tip/understand_menu.png");
    case "escalator_etiquette.png":
      return require("../assets/images/tip/escalator_etiquette.png");
    case "explore_alley.png":
      return require("../assets/images/tip/explore_alley.png");
    case "escalator_etiquette.png":
      return require("../assets/images/tip/escalator_etiquette.png");
    case "walking_tour.png":
      return require("../assets/images/tip/walking_tour.png");
    case "respect.png":
      return require("../assets/images/tip/respect.png");
    case "litter_free_zone.png":
      return require("../assets/images/tip/litter_free_zone.png");
    case "photo_etiquette.png":
      return require("../assets/images/tip/photo_etiquette.png");
    case "pedestrian_etiquette.png":
      return require("../assets/images/tip/pedestrian_etiquette.png");
    case "walking_tour.png":
      return require("../assets/images/tip/walking_tour.png");
    case "multi_society.png":
      return require("../assets/images/tip/multi_society.png");
    case "respect.png":
      return require("../assets/images/tip/respect.png");
    case "safety_awareness.png":
      return require("../assets/images/tip/safety_awareness.png");
    case "respect.png":
      return require("../assets/images/tip/respect.png");
    case "emergency_call.png":
      return require("../assets/images/tip/emergency_call.png");
    case "understand_menu.png":
      return require("../assets/images/tip/understand_menu.png");
    case "dress_modestly.png":
      return require("../assets/images/tip/dress_modestly.png");
    case "dress_modestly.png":
      return require("../assets/images/tip/dress_modestly.png");
    case "respect.png":
      return require("../assets/images/tip/respect.png");
    case "remove_footwear.png":
      return require("../assets/images/tip/remove_footwear.png");
    case "signal_direction.png":
      return require("../assets/images/tip/signal_direction.png");
    case "touching.png":
      return require("../assets/images/tip/touching.png");
    case "touching.png":
      return require("../assets/images/tip/touching.png");
    case "respect.png":
      return require("../assets/images/tip/respect.png");
    case "photo_etiquette.png":
      return require("../assets/images/tip/photo_etiquette.png");
    case "walking_tour.png":
      return require("../assets/images/tip/walking_tour.png");
    case "respect.png":
      return require("../assets/images/tip/respect.png");
    case "litter_free_zone.png":
      return require("../assets/images/tip/litter_free_zone.png");
    case "arrival_time.png":
      return require("../assets/images/tip/arrival_time.png");
    case "multi_society.png":
      return require("../assets/images/tip/multi_society.png");
    case "appointment_booking.png":
      return require("../assets/images/tip/appointment_booking.png");
    case "personal_distance.png":
      return require("../assets/images/tip/personal_distance.png");
    case "photo_etiquette.png":
      return require("../assets/images/tip/photo_etiquette.png");
    case "respect.png":
      return require("../assets/images/tip/respect.png");
    case "arrival_time.png":
      return require("../assets/images/tip/arrival_time.png");
    case "multi_society.png":
      return require("../assets/images/tip/multi_society.png");
    case "payment_options.png":
      return require("../assets/images/tip/payment_options.png");
    case "reservation.png":
      return require("../assets/images/tip/reservation.png");
    case "dress_modestly.png":
      return require("../assets/images/tip/dress_modestly.png");
    case "arrival_time.png":
      return require("../assets/images/tip/arrival_time.png");
    case "waiting_area.png":
      return require("../assets/images/tip/waiting_area.png");
    case "waiting_area.png":
      return require("../assets/images/tip/waiting_area.png");
    case "phone_use.png":
      return require("../assets/images/tip/phone_use.png");
    case "ordering.png":
      return require("../assets/images/tip/ordering.png");
    case "understand_menu.png":
      return require("../assets/images/tip/understand_menu.png");
    case "respect.png":
      return require("../assets/images/tip/respect.png");
    case "respect.png":
      return require("../assets/images/tip/respect.png");
    case "understand_menu.png":
      return require("../assets/images/tip/understand_menu.png");
    case "safety_awareness.png":
      return require("../assets/images/tip/safety_awareness.png");
    case "payment_options.png":
      return require("../assets/images/tip/payment_options.png");
    case "reservation.png":
      return require("../assets/images/tip/reservation.png");
    case "dress_modestly.png":
      return require("../assets/images/tip/dress_modestly.png");
    case "utensil_use.png":
      return require("../assets/images/tip/utensil_use.png");
    case "polite_declining.png":
      return require("../assets/images/tip/polite_declining.png");
    case "understand_menu.png":
      return require("../assets/images/tip/understand_menu.png");
    case "indian_food_variety.png":
      return require("../assets/images/tip/indian_food_variety.png");
    case "spicy.png":
      return require("../assets/images/tip/spicy.png");
    case "ingredient_availability.png":
      return require("../assets/images/tip/ingredient_availability.png");
    case "indian_food_variety.png":
      return require("../assets/images/tip/indian_food_variety.png");
    case "indian_food_variety.png":
      return require("../assets/images/tip/indian_food_variety.png");
    case "spicy.png":
      return require("../assets/images/tip/spicy.png");
    case "multi_society.png":
      return require("../assets/images/tip/multi_society.png");
    case "ordering.png":
      return require("../assets/images/tip/ordering.png");
    case "indian_food_variety.png":
      return require("../assets/images/tip/indian_food_variety.png");
    case "indian_food_variety.png":
      return require("../assets/images/tip/indian_food_variety.png");
    case "indian_food_variety.png":
      return require("../assets/images/tip/indian_food_variety.png");
    case "reservation.png":
      return require("../assets/images/tip/reservation.png");
    case "utensil_use.png":
      return require("../assets/images/tip/utensil_use.png");
    case "chinese_food_variety.png":
      return require("../assets/images/tip/chinese_food_variety.png");
    case "authenticity.png":
      return require("../assets/images/tip/authenticity.png");
    case "ingredient_availability.png":
      return require("../assets/images/tip/ingredient_availability.png");
    case "food_presentation.png":
      return require("../assets/images/tip/food_presentation.png");
    case "chinese_food_variety.png":
      return require("../assets/images/tip/chinese_food_variety.png");
    case "chinese_food_variety.png":
      return require("../assets/images/tip/chinese_food_variety.png");
    case "multi_society.png":
      return require("../assets/images/tip/multi_society.png");
    case "chinese_food_variety.png":
      return require("../assets/images/tip/chinese_food_variety.png");
    case "spicy.png":
      return require("../assets/images/tip/spicy.png");
    case "tea.png":
      return require("../assets/images/tip/tea.png");
    case "stay_hydrated.png":
      return require("../assets/images/tip/stay_hydrated.png");
    case "respect.png":
      return require("../assets/images/tip/respect.png");
    case "polite_declining.png":
      return require("../assets/images/tip/polite_declining.png");
    case "ordering.png":
      return require("../assets/images/tip/ordering.png");
    case "understand_menu.png":
      return require("../assets/images/tip/understand_menu.png");
    case "local_market.png":
      return require("../assets/images/tip/local_market.png");
    case "convenience_store.png":
      return require("../assets/images/tip/convenience_store.png");
    case "shopping_list.png":
      return require("../assets/images/tip/shopping_list.png");
    case "seasonal_produce.png":
      return require("../assets/images/tip/seasonal_produce.png");
    case "compare_price.png":
      return require("../assets/images/tip/compare_price.png");
    case "bulk_buying.png":
      return require("../assets/images/tip/bulk_buying.png");
    case "payment_options.png":
      return require("../assets/images/tip/payment_options.png");
    case "price_match.png":
      return require("../assets/images/tip/price_match.png");
    case "reward.png":
      return require("../assets/images/tip/reward.png");
    case "reusable_bag.png":
      return require("../assets/images/tip/reusable_bag.png");
    case "eco_package.png":
      return require("../assets/images/tip/eco_package.png");
    case "botanical_garden.png":
      return require("../assets/images/tip/botanical_garden.png");
    case "cafe_culture.png":
      return require("../assets/images/tip/cafe_culture.png");
    case "federation_square.png":
      return require("../assets/images/tip/federation_square.png");
    case "carlton_garden.png":
      return require("../assets/images/tip/carlton_garden.png");
    case "yarra_cruise.png":
      return require("../assets/images/tip/yarra_cruise.png");
    case "eureka_sunset.png":
      return require("../assets/images/tip/eureka_sunset.png");
    case "st_kilda_coffee.png":
      return require("../assets/images/tip/st_kilda_coffee.png");
    case "morning_yoga.png":
      return require("../assets/images/tip/morning_yoga.png");
    case "fitzroy_garden.png":
      return require("../assets/images/tip/fitzroy_garden.png");
    case "art_workshop.png":
      return require("../assets/images/tip/art_workshop.png");
    case "outdoor_taichi.png":
      return require("../assets/images/tip/outdoor_taichi.png");
    case "st_kilda_walk.png":
      return require("../assets/images/tip/st_kilda_walk.png");
    case "guided_meditation.png":
      return require("../assets/images/tip/guided_meditation.png");
    case "art_gallery.png":
      return require("../assets/images/tip/art_gallery.png");
    case "federation_square.png":
      return require("../assets/images/tip/federation_square.png");
    case "walking_tour.png":
      return require("../assets/images/tip/walking_tour.png");
    case "open_theatre.png":
      return require("../assets/images/tip/open_theatre.png");
    case "live_jazz.png":
      return require("../assets/images/tip/live_jazz.png");
    case "outdoor_art.png":
      return require("../assets/images/tip/outdoor_art.png");
    case "yarra_cruise.png":
      return require("../assets/images/tip/yarra_cruise.png");
    case "emergency_call.png":
      return require("../assets/images/tip/emergency_call.png");
    case "family_contact.png":
      return require("../assets/images/tip/family_contact.png");
    case "safety_awareness.png":
      return require("../assets/images/tip/safety_awareness.png");
    case "family_contact.png":
      return require("../assets/images/tip/family_contact.png");
    case "offline_map.png":
      return require("../assets/images/tip/offline_map.png");
    case "yarra_cruise.png":
      return require("../assets/images/tip/yarra_cruise.png");
    case "urgent_care.png":
      return require("../assets/images/tip/urgent_care.png");
    case "first_aid.png":
      return require("../assets/images/tip/first_aid.png");
    case "allergies.png":
      return require("../assets/images/tip/allergies.png");
    case "pharmacist_consultation.png":
      return require("../assets/images/tip/pharmacist_consultation.png");
    case "open_hours.png":
      return require("../assets/images/tip/open_hours.png");
    case "script_refill.png":
      return require("../assets/images/tip/script_refill.png");
    case "translation.png":
      return require("../assets/images/tip/translation.png");
    case "urgent_care.png":
      return require("../assets/images/tip/urgent_care.png");
    case "pharm_loc.png":
      return require("../assets/images/tip/pharm_loc.png");
    case "emergency_ambulance.png":
      return require("../assets/images/tip/emergency_ambulance.png");
    case "appointment_booking.png":
      return require("../assets/images/tip/appointment_booking.png");
    case "pharmacist_consultation.png":
      return require("../assets/images/tip/pharmacist_consultation.png");
    case "translation.png":
      return require("../assets/images/tip/translation.png");
    case "aus_dollars.png":
      return require("../assets/images/tip/aus_dollars.png");
    case "payment_options.png":
      return require("../assets/images/tip/payment_options.png");
    case "foreign_transaction.png":
      return require("../assets/images/tip/foreign_transaction.png");
    case "atm_location.png":
      return require("../assets/images/tip/atm_location.png");
    case "cash_disc.png":
      return require("../assets/images/tip/cash_disc.png");
    case "service_tax.png":
      return require("../assets/images/tip/service_tax.png");
    case "tourist_refund.png":
      return require("../assets/images/tip/tourist_refund.png");
    case "compare_price.png":
      return require("../assets/images/tip/compare_price.png");
    case "emergency_cash.png":
      return require("../assets/images/tip/emergency_cash.png");
    case "secure_transaction.png":
      return require("../assets/images/tip/secure_transaction.png");
    case "informal_greetings.png":
      return require("../assets/images/tip/informal_greetings.png");
    case "personal_distance.png":
      return require("../assets/images/tip/personal_distance.png");
    case "friendly_banter.png":
      return require("../assets/images/tip/friendly_banter.png");
    case "barbe_culture.png":
      return require("../assets/images/tip/barbe_culture.png");
    case "cafe_culture.png":
      return require("../assets/images/tip/cafe_culture.png");
    case "local_culture.png":
      return require("../assets/images/tip/local_culture.png");
    case "indi_culture.png":
      return require("../assets/images/tip/indi_culture.png");
    case "multi_society.png":
      return require("../assets/images/tip/multi_society.png");
    case "festival_celebration.png":
      return require("../assets/images/tip/festival_celebration.png");
    case "aus_slangs.png":
      return require("../assets/images/tip/aus_slangs.png");
    case "friendly_banter.png":
      return require("../assets/images/tip/friendly_banter.png");
  }
};

export function TipImage({
  photo,
  imageStyle,
  onPress,
}: {
  photo: string;
  imageStyle?: any;
  onPress?: () => void;
}) {
  return (
    getTipImage(photo) && (
      <TouchableOpacity onPress={onPress} style={imageStyle}>
        <Image source={getTipImage(photo)} />
      </TouchableOpacity>
    )
  );
}
