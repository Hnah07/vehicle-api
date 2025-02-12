export const getLicense = (vehicle: any) => {
  if (vehicle.cc <= 125) {
    return { ...vehicle.toObject(), license: "A1" };
  } else if (vehicle.cc > 125 && vehicle.cc <= 500) {
    return { ...vehicle.toObject(), license: "A2" };
  } else {
    return { ...vehicle.toObject(), license: "A" };
  }
};
