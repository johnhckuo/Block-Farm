import { Session } from 'meteor/session';
import { Promise } from 'meteor/promise';

if(typeof web3 === 'undefined')
        web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

currentAccount = 1;
cropsPerLvl =3;

cropTypeList = [
  {
        id:0,
        name: "Carrot",
        img: ["carrot_seed", "carrot_grow", "carrot_harvest", "carrot", "carrot_warn"],
        count:4,
        time:"0.0.0.3"

    },
    {
        id:1,
        name: "Radish",
        img: ["radish_seed", "radish_grow", "radish_harvest", "radish", "radish_warn"],
        count:4,
        time:"0.0.0.5"

    },
    {
        id:2,
        name: "Lettuce",
        img: ["lettuce_seed", "lettuce_grow", "lettuce_harvest", "lettuce", "lettuce_warn"],
        count:4,
        time:"0.0.0.3"

    },
    {
        id:3,
        name: "Cauliflower",
        img: ["cauliflower_seed", "cauliflower_grow", "cauliflower_harvest", "cauliflower", "cauliflower_warn"],
        count:4,
        time:"0.0.0.10"

    },
    {
        id:4,
        name: "Eggplant",
        img: ["eggplant_seed", "eggplant_grow", "eggplant_harvest", "eggplant", "eggplant_warn"],
        count:4,
        time:"0.0.0.10"

    },
    {
        id:5,
        name: "Blueberry",
        img: ["blueberry_seed", "blueberry_grow", "blueberry_harvest", "blueberry", "blueberry_warn"],
        count:4,
        time:"0.0.0.10"

    },
    {
        id:6,
        name: "Chili",
        img: ["chili_seed", "chili_grow", "chili_harvest", "chili", "chili_warn"],
        count:4,
        time:"0.0.2.0"

    },
    {
        id:7,
        name: "Watermelon",
        img: ["watermelon_seed", "watermelon_grow", "watermelon_harvest", "watermelon", "watermelon_warn"],
        count:4,
        time:"0.0.2.0"

    },
    {
        id:8,
        name: "Strawberry",
        img: ["strawberry_seed", "strawberry_grow", "strawberry_harvest", "strawberry", "strawberry_warn"],
        count:4,
        time:"0.0.2.0"

    },
    {
        id:9,
        name: "Loofa",
        img: ["loofa_seed", "loofa_grow", "loofa_harvest", "loofa", "loofa_warn"],
        count:4,
        time:"0.0.5.0"

    },
    {
        id:10,
        name: "Honeydew melon",
        img: ["hamimelon_seed", "hamimelon_grow", "hamimelon_harvest", "hamimelon", "hamimelon_warn"],
        count:4,
        time:"0.0.5.0"

    },
    {
        id:11,
        name: "Green pepper",
        img: ["greenPepper_seed", "greenPepper_grow", "greenPepper_harvest", "greenPepper", "greenPepper_warn"],
        count:4,
        time:"0.0.5.0"

    },
    {
        id:12,
        name: "Onion",
        img: ["onion_seed", "onion_grow", "onion_harvest", "onion", "onion_warn"],
        count:4,
        time:"0.0.10.0"

    },
    {
        id:13,
        name: "Scallion",
        img: ["sansingOnion_seed", "sansingOnion_grow", "sansingOnion_harvest", "sansingOnion", "sansingOnion_warn"],
        count:4,
        time:"0.0.10.0"

    },
    {
        id:14,
        name: "Grape",
        img: ["grape_seed", "grape_grow", "grape_harvest", "grape", "grape_warn"],
        count:4,
        time:"0.0.10.0"

    },
    {
        id:15,
        name: "Bamboo",
        img: ["bamboo_seed", "bamboo_grow", "bamboo_harvest", "bamboo", "bamboo_warn"],
        count:4,
        time:"0.0.15.0"

    },
    {
        id:16,
        name: "Apple",
        img: ["apple_seed", "apple_grow", "apple_harvest", "apple", "apple_warn"],
        count:4,
        time:"0.0.15.0"

    },
    {
        id:17,
        name: "Wheat",
        img: ["wheat_seed", "wheat_grow", "wheat_harvest", "wheat", "wheat_warn"],
        count:4,
        time:"0.0.15.0"

    },
    {
        id:18,
        name: "Corn",
        img: ["corn_seed", "corn_grow", "corn_harvest", "corn", "corn_warn"],
        count:4,
        time:"0.0.30.0"

    },
    {
        id:19,
        name: "Pear",
        img: ["pear_seed", "pear_grow", "pear_harvest", "pear", "pear_warn"],
        count:4,
        time:"0.0.30.0"

    },
    {
        id:20,
        name: "Lemon",
        img: ["lemon_seed", "lemon_grow", "lemon_harvest", "lemon", "lemon_warn"],
        count:4,
        time:"0.0.30.0"

    },
    {
        id:21,
        name: "Mushroom",
        img: ["mushroom_seed", "mushroom_grow", "mushroom_harvest", "mushroom", "mushroom_warn"],
        count:4,
        time:"0.1.0.0"
    },
    {
        id:22,
        name: "Cactus",
        img: ["cactus_seed", "cactus_grow", "cactus_harvest", "cactus", "cactus_warn"],
        count:4,
        time:"0.1.0.0"
    },
    {
        id:23,
        name: "Banana",
        img: ["banana_seed", "banana_grow", "banana_harvest", "banana", "banana_warn"],
        count:4,
        time:"0.1.0.0"
    },
    {
        id:24,
        name: "Cupcake",
        img: ["cupcake_seed", "cupcake_grow", "cupcake_harvest", "cupcake", "cupcake_warn"],
        count:4,
        time:"0.2.0.0"
    },
    {
        id:25,
        name: "Doughnut",
        img: ["doughnut_seed", "doughnut_grow", "doughnut_harvest", "doughnut", "doughnut_warn"],
        count:4,
        time:"0.2.0.0"
    },
    {
        id:26,
        name: "Gingerbread Man",
        img: ["gingerbread_man_seed", "gingerbread_man_grow", "gingerbread_man_harvest", "gingerbread_man", "gingerbread_man_warn"],
        count:4,
        time:"0.2.0.0"
    },
    {
        id:27,
        name: "Egg",
        img: ["egg_seed", "egg_grow", "egg_harvest", "egg", "egg_warn"],
        count:4,
        time:"0.4.0.0"
    },
    {
        id:28,
        name: "Chicken",
        img: ["chicken_seed", "chicken_grow", "chicken_harvest", "chicken", "chicken_warn"],
        count:4,
        time:"0.4.0.0"
    },
    {
        id:29,
        name: "Report",
        img: ["report_seed", "report_grow", "report_harvest", "report", "report_warn"],
        count:4,
        time:"0.4.0.0"
    },
    {
        id:30,
        name: "Guard Level 1",
        img: ["guard_1", "guard_1", "guard_1", "guard_1", "guard_1"],
        count:1,
        time:"0.0.0.0"
    },
    {
        id:31,
        name: "Guard Level 2",
        img: ["guard_2", "guard_2", "guard_2", "guard_2", "guard_2"],
        count:1,
        time:"0.0.0.0"
    },
    {
        id:32,
        name: "Guard Level 3",
        img: ["guard_3", "guard_3", "guard_3", "guard_3", "guard_3"],
        count:1,
        time:"0.0.0.0"
    },
    {
        id:33,
        name: "Guard Level 4",
        img: ["guard_4", "guard_4", "guard_4", "guard_4", "guard_4"],
        count:1,
        time:"0.0.0.0"
    },
    {
        id:34,
        name: "Guard Level 5",
        img: ["guard_5", "guard_5", "guard_5", "guard_5", "guard_5"],
        count:1,
        time:"0.0.0.0"
    },
    {
        id:35,
        name: "Guard Level 6",
        img: ["guard_6", "guard_6", "guard_6", "guard_6", "guard_6"],
        count:1,
        time:"0.0.0.0"
    },
    {
        id:36,
        name: "Guard Level 7",
        img: ["guard_7", "guard_7", "guard_7", "guard_7", "guard_7"],
        count:1,
        time:"0.0.0.0"
    },
    {
        id:37,
        name: "Guard Level 8",
        img: ["guard_8", "guard_8", "guard_8", "guard_8", "guard_8"],
        count:1,
        time:"0.0.0.0"
    },
    {
        id:38,
        name: "Guard Level 9",
        img: ["guard_9", "guard_9", "guard_9", "guard_9", "guard_9"],
        count:1,
        time:"0.0.0.0"
    },
    {
        id:39,
        name: "Guard Level 10",
        img: ["guard_10", "guard_10", "guard_10", "guard_10", "guard_10"],
        count:1,
        time:"0.0.0.0"
    },


];

landTypeList = [
  {
      id:0,
      name: "Dirt",
      img: "land",
      count:0,
  }

];

MissionList = [
    {
        name: "Mission0-1",
        exp: 20,
        lvl_limitation:0,
        status:true
    },
    {
        name: "Mission0-2",
        exp: 20,
        lvl_limitation:0,
        status:true
    },
    {
        name: "Mission0-3",
        exp: 20,
        lvl_limitation:0,
        status:true
    },
    {
        name: "Mission1-1",
        exp: 30,
        lvl_limitation:1,
        status:true
    },
    {
        name: "Mission1-2",
        exp: 30,
        lvl_limitation:1,
        status:true
    },
    {
        name: "Mission1-3",
        exp: 30,
        lvl_limitation:1,
        status:true
    },
    {
        name: "Mission2-1",
        exp: 100,
        lvl_limitation:2,
        status:true
    },
    {
        name: "Mission2-2",
        exp: 100,
        lvl_limitation:2,
        status:true
    },
    {
        name: "Mission2-3",
        exp: 100,
        lvl_limitation:2,
        status:true
    },
    {
        name: "Mission3-1",
        exp: 250,
        lvl_limitation:3,
        status:true
    },
    {
        name: "Mission3-2",
        exp: 250,
        lvl_limitation:3,
        status:true
    },
    {
        name: "Mission3-3",
        exp: 250,
        lvl_limitation:3,
        status:true
    },
    {
        name: "Mission4-1",
        exp: 450,
        lvl_limitation:4,
        status:true
    },
    {
        name: "Mission4-2",
        exp: 450,
        lvl_limitation:4,
        status:true
    },
    {
        name: "Mission4-3",
        exp: 450,
        lvl_limitation:4,
        status:true
    },
    {
        name: "Mission5-1",
        exp: 1000,
        lvl_limitation:5,
        status:true
    },
    {
        name: "Mission5-2",
        exp: 1000,
        lvl_limitation:5,
        status:true
    },
    {
        name: "Mission5-3",
        exp: 1000,
        lvl_limitation:5,
        status:true
    },
    {
        name: "Mission6-1",
        exp: 2000,
        lvl_limitation:6,
        status:true
    },
    {
        name: "Mission6-2",
        exp: 2000,
        lvl_limitation:6,
        status:true
    },
    {
        name: "Mission6-3",
        exp: 2000,
        lvl_limitation:6,
        status:true
    },
    {
        name: "Mission7-1",
        exp: 4200,
        lvl_limitation:7,
        status:true
    },
    {
        name: "Mission7-2",
        exp: 4200,
        lvl_limitation:7,
        status:true
    },
    {
        name: "Mission7-3",
        exp: 4200,
        lvl_limitation:7,
        status:true
    },
    {
        name: "Mission8-1",
        exp: 8400,
        lvl_limitation:8,
        status:true
    },
    {
        name: "Mission8-2",
        exp: 8400,
        lvl_limitation:8,
        status:true
    },
    {
        name: "Mission8-3",
        exp: 8400,
        lvl_limitation:8,
        status:true
    },
    {
        name: "Mission9-1",
        exp: 16500,
        lvl_limitation:9,
        status:true
    },
    {
        name: "Mission9-2",
        exp: 16500,
        lvl_limitation:9,
        status:true
    },
    {
        name: "Mission9-3",
        exp: 16500,
        lvl_limitation:9,
        status:true
    },
    {
        name: "Mission10-1",
        exp: 34200,
        lvl_limitation:10,
        status:true
    },
    {
        name: "Mission10-2",
        exp: 34200,
        lvl_limitation:10,
        status:true
    },
    {
        name: "Mission10-3",
        exp: 34200,
        lvl_limitation:10,
        status:true
    },
    {
        name: "Mission11-1",
        exp: 64000,
        lvl_limitation:11,
        status:true
    },
    {
        name: "Mission11-2",
        exp: 64000,
        lvl_limitation:11,
        status:true
    },
    {
        name: "Mission11-3",
        exp: 64000,
        lvl_limitation:11,
        status:true
    },
    {
        name: "Mission12-1",
        exp: 135000,
        lvl_limitation:12,
        status:true
    },
    {
        name: "Mission12-2",
        exp: 135000,
        lvl_limitation:12,
        status:true
    },
    {
        name: "Mission12-3",
        exp: 135000,
        lvl_limitation:12,
        status:true
    },
    {
        name: "Mission13-1",
        exp: 270000,
        lvl_limitation:13,
        status:true
    },
    {
        name: "Mission13-2",
        exp: 270000,
        lvl_limitation:13,
        status:true
    },
    {
        name: "Mission13-3",
        exp: 270000,
        lvl_limitation:13,
        status:true
    },
    {
        name: "Mission14-1",
        exp: 545000,
        lvl_limitation:14,
        status:true
    },
    {
        name: "Mission14-2",
        exp: 545000,
        lvl_limitation:14,
        status:true
    },
    {
        name: "Mission14-3",
        exp: 545000,
        lvl_limitation:14,
        status:true
    },
    {
        name: "Mission15-1",
        exp: 1090000,
        lvl_limitation:15,
        status:true
    },
    {
        name: "Mission15-2",
        exp: 1090000,
        lvl_limitation:15,
        status:true
    },
    {
        name: "Mission15-3",
        exp: 1090000,
        lvl_limitation:15,
        status:true
    },
    {
        name: "Mission16-1",
        exp: 2250000,
        lvl_limitation:16,
        status:true
    },
    {
        name: "Mission16-2",
        exp: 2250000,
        lvl_limitation:16,
        status:true
    },
    {
        name: "Mission16-3",
        exp: 2250000,
        lvl_limitation:16,
        status:true
    },
    {
        name: "Mission17-1",
        exp: 4550000,
        lvl_limitation:17,
        status:true
    },
    {
        name: "Mission17-2",
        exp: 4550000,
        lvl_limitation:17,
        status:true
    },
    {
        name: "Mission17-3",
        exp: 4550000,
        lvl_limitation:17,
        status:true
    },
    {
        name: "Mission18-1",
        exp: 8960000,
        lvl_limitation:18,
        status:true
    },
    {
        name: "Mission18-2",
        exp: 8960000,
        lvl_limitation:18,
        status:true
    },
    {
        name: "Mission18-3",
        exp: 8960000,
        lvl_limitation:18,
        status:true
    },
    {
        name: "Mission19-1",
        exp: 17600000,
        lvl_limitation:19,
        status:true
    },
    {
        name: "Mission19-2",
        exp: 17600000,
        lvl_limitation:19,
        status:true
    },
    {
        name: "Mission19-3",
        exp: 17600000,
        lvl_limitation:19,
        status:true
    },
    {
        name: "Mission20-1",
        exp: 35800000,
        lvl_limitation:20,
        status:true
    },
    {
        name: "Mission20-2",
        exp: 35800000,
        lvl_limitation:20,
        status:true
    },
    {
        name: "Mission20-3",
        exp: 35800000,
        lvl_limitation:20,
        status:true
    },
    {
        name: "Mission21-1",
        exp: 70400000,
        lvl_limitation:21,
        status:true
    },
    {
        name: "Mission21-2",
        exp: 70400000,
        lvl_limitation:21,
        status:true
    },
    {
        name: "Mission21-3",
        exp: 70400000,
        lvl_limitation:21,
        status:true
    },
    {
        name: "Mission22-1",
        exp: 142000000,
        lvl_limitation:22,
        status:true
    },
    {
        name: "Mission22-2",
        exp: 142000000,
        lvl_limitation:22,
        status:true
    },
    {
        name: "Mission22-3",
        exp: 142000000,
        lvl_limitation:22,
        status:true
    },
    {
        name: "Mission23-1",
        exp: 289000000,
        lvl_limitation:23,
        status:true
    },
    {
        name: "Mission23-2",
        exp: 289000000,
        lvl_limitation:23,
        status:true
    },
    {
        name: "Mission23-3",
        exp: 289000000,
        lvl_limitation:23,
        status:true
    },
    {
        name: "Mission24-1",
        exp: 570000000,
        lvl_limitation:24,
        status:true
    },
    {
        name: "Mission24-2",
        exp: 570000000,
        lvl_limitation:24,
        status:true
    },
    {
        name: "Mission24-3",
        exp: 570000000,
        lvl_limitation:24,
        status:true
    },
    {
        name: "Mission25-1",
        exp: 1160000000,
        lvl_limitation:25,
        status:true
    },
    {
        name: "Mission25-2",
        exp: 1160000000,
        lvl_limitation:25,
        status:true
    },
    {
        name: "Mission25-3",
        exp: 1160000000,
        lvl_limitation:25,
        status:true
    },
    {
        name: "Mission26-1",
        exp: 2350000000,
        lvl_limitation:26,
        status:true
    },
    {
        name: "Mission26-2",
        exp: 2350000000,
        lvl_limitation:26,
        status:true
    },
    {
        name: "Mission26-3",
        exp: 2350000000,
        lvl_limitation:26,
        status:true
    },
    {
        name: "Mission27-1",
        exp: 4780000000,
        lvl_limitation:27,
        status:true
    },
    {
        name: "Mission27-2",
        exp: 4780000000,
        lvl_limitation:27,
        status:true
    },
    {
        name: "Mission27-3",
        exp: 4780000000,
        lvl_limitation:27,
        status:true
    },
    {
        name: "Mission28-1",
        exp: 9180000000,
        lvl_limitation:28,
        status:true
    },
    {
        name: "Mission28-2",
        exp: 9180000000,
        lvl_limitation:28,
        status:true
    },
    {
        name: "Mission28-3",
        exp: 9180000000,
        lvl_limitation:28,
        status:true
    },
    {
        name: "Mission29-1",
        exp: 18450000000,
        lvl_limitation:29,
        status:true
    },
    {
        name: "Mission29-2",
        exp: 18450000000,
        lvl_limitation:29,
        status:true
    },
    {
        name: "Mission29-3",
        exp: 18450000000,
        lvl_limitation:29,
        status:true
    },
    {
        name: "Mission30-1",
        exp: 36680000000,
        lvl_limitation:30,
        status:true
    },
    {
        name: "Mission30-2",
        exp: 36680000000,
        lvl_limitation:30,
        status:true
    },
    {
        name: "Mission30-3",
        exp: 36680000000,
        lvl_limitation:30,
        status:true
    },
    {
        name: "Mission31-1",
        exp: 72550000000,
        lvl_limitation:31,
        status:true
    },
    {
        name: "Mission31-2",
        exp: 72550000000,
        lvl_limitation:31,
        status:true
    },
    {
        name: "Mission31-3",
        exp: 72550000000,
        lvl_limitation:31,
        status:true
    },
    {
        name: "Mission32-1",
        exp: 152900000000,
        lvl_limitation:32,
        status:true
    },
    {
        name: "Mission32-2",
        exp: 152900000000,
        lvl_limitation:32,
        status:true
    },
    {
        name: "Mission32-3",
        exp: 152900000000,
        lvl_limitation:32,
        status:true
    },
    {
        name: "Mission33-1",
        exp: 305600000000,
        lvl_limitation:33,
        status:true
    },
    {
        name: "Mission33-2",
        exp: 305600000000,
        lvl_limitation:33,
        status:true
    },
    {
        name: "Mission33-3",
        exp: 305600000000,
        lvl_limitation:33,
        status:true
    },
    {
        name: "Mission34-1",
        exp: 625300000000,
        lvl_limitation:34,
        status:true
    },
    {
        name: "Mission34-2",
        exp: 625300000000,
        lvl_limitation:34,
        status:true
    },
    {
        name: "Mission34-3",
        exp: 625300000000,
        lvl_limitation:34,
        status:true
    },
    {
        name: "Mission35-1",
        exp: 1250000000000,
        lvl_limitation:35,
        status:true
    },
    {
        name: "Mission35-2",
        exp: 1250000000000,
        lvl_limitation:35,
        status:true
    },
    {
        name: "Mission35-3",
        exp: 1250000000000,
        lvl_limitation:35,
        status:true
    },
    {
        name: "Mission36-1",
        exp: 2500000000000,
        lvl_limitation:36,
        status:true
    },
    {
        name: "Mission36-2",
        exp: 2500000000000,
        lvl_limitation:36,
        status:true
    },
    {
        name: "Mission36-3",
        exp: 2500000000000,
        lvl_limitation:36,
        status:true
    },
    {
        name: "Mission37-1",
        exp: 4800000000000,
        lvl_limitation:37,
        status:true
    },
    {
        name: "Mission37-2",
        exp: 4800000000000,
        lvl_limitation:37,
        status:true
    },
    {
        name: "Mission37-3",
        exp: 4800000000000,
        lvl_limitation:37,
        status:true
    },
    {
        name: "Mission38-1",
        exp: 9600000000000,
        lvl_limitation:38,
        status:true
    },
    {
        name: "Mission38-2",
        exp: 9600000000000,
        lvl_limitation:38,
        status:true
    },
    {
        name: "Mission38-3",
        exp: 9600000000000,
        lvl_limitation:38,
        status:true
    },
    {
        name: "Mission39-1",
        exp: 20900000000000,
        lvl_limitation:39,
        status:true
    },
    {
        name: "Mission39-2",
        exp: 20900000000000,
        lvl_limitation:39,
        status:true
    },
    {
        name: "Mission39-3",
        exp: 20900000000000,
        lvl_limitation:39,
        status:true
    },
    {
        name: "Mission40-1",
        exp: 43200000000000,
        lvl_limitation:40,
        status:true
    },
    {
        name: "Mission40-2",
        exp: 43200000000000,
        lvl_limitation:40,
        status:true
    },
    {
        name: "Mission40-3",
        exp: 43200000000000,
        lvl_limitation:40,
        status:true
    },
    {
        name: "Mission41-1",
        exp: 86500000000000,
        lvl_limitation:41,
        status:true
    },
    {
        name: "Mission41-2",
        exp: 86500000000000,
        lvl_limitation:41,
        status:true
    },
    {
        name: "Mission41-3",
        exp: 86500000000000,
        lvl_limitation:41,
        status:true
    },
    {
        name: "Mission42-1",
        exp: 168000000000000,
        lvl_limitation:42,
        status:true
    },
    {
        name: "Mission42-2",
        exp: 168000000000000,
        lvl_limitation:42,
        status:true
    },
    {
        name: "Mission42-3",
        exp: 168000000000000,
        lvl_limitation:42,
        status:true
    },
    {
        name: "Mission43-1",
        exp: 345000000000000,
        lvl_limitation:43,
        status:true
    },
    {
        name: "Mission43-2",
        exp: 345000000000000,
        lvl_limitation:43,
        status:true
    },
    {
        name: "Mission43-3",
        exp: 345000000000000,
        lvl_limitation:43,
        status:true
    },
    {
        name: "Mission44-1",
        exp: 707000000000000,
        lvl_limitation:44,
        status:true
    },
    {
        name: "Mission44-2",
        exp: 707000000000000,
        lvl_limitation:44,
        status:true
    },
    {
        name: "Mission44-3",
        exp: 707000000000000,
        lvl_limitation:44,
        status:true
    }

];

missionItem = [
    // Mission0-
    {
        missionId: 1,
        propertyId :0,
        quantity: 4
    },
    {
        missionId: 2,
        propertyId :1,
        quantity: 4
    },
    {
        missionId: 3,
        propertyId :2,
        quantity: 4
    },
    // Mission1-
    {
        missionId: 4,
        propertyId :0,
        quantity: 8
    },
    {
        missionId: 5,
        propertyId :1,
        quantity: 8
    },
    {
        missionId: 6,
        propertyId :2,
        quantity: 8
    },
    // Mission2-
    {
        missionId: 7,
        propertyId :0,
        quantity: 30
    },
    {
        missionId: 8,
        propertyId :1,
        quantity: 30
    },
    {
        missionId: 9,
        propertyId :2,
        quantity: 30
    },
    // Mission3-
    {
        missionId: 10,
        propertyId :0,
        quantity: 4
    },
    {
        missionId: 10,
        propertyId :1,
        quantity: 4
    },
    {
        missionId: 11,
        propertyId :1,
        quantity: 4
    },
        {
        missionId: 11,
        propertyId :2,
        quantity: 4
    },
    {
        missionId: 12,
        propertyId :0,
        quantity: 4
    },
    {
        missionId: 12,
        propertyId :2,
        quantity: 4
    },
    // Mission4-
    {
        missionId: 13,
        propertyId :0,
        quantity: 4
    },
    {
        missionId: 13,
        propertyId :2,
        quantity: 8
    },
    {
        missionId: 14,
        propertyId :1,
        quantity: 4
    },
    {
        missionId: 14,
        propertyId :0,
        quantity: 8
    },
    {
        missionId: 15,
        propertyId :1,
        quantity: 8
    },
    {
        missionId: 15,
        propertyId :2,
        quantity: 4
    },
    // Mission5-
    {
        missionId: 16,
        propertyId :3,
        quantity: 8
    },
    {
        missionId: 17,
        propertyId :4,
        quantity: 8
    },
    {
        missionId: 18,
        propertyId :5,
        quantity: 8
    },
    // Mission6-
    {
        missionId: 19,
        propertyId :3,
        quantity: 16
    },
    {
        missionId: 20,
        propertyId :4,
        quantity: 16
    },
    {
        missionId: 21,
        propertyId :5,
        quantity: 16
    },
    // Mission7-
    {
        missionId: 22,
        propertyId :3,
        quantity: 8
    },
    {
        missionId: 22,
        propertyId :1,
        quantity: 4
    },
    {
        missionId: 23,
        propertyId :4,
        quantity: 8
    },
    {
        missionId: 23,
        propertyId :2,
        quantity: 4
    },
    {
        missionId: 24,
        propertyId :5,
        quantity: 8
    },
    {
        missionId: 24,
        propertyId :0,
        quantity: 4
    },
    // Mission8-
    {
        missionId: 25,
        propertyId :3,
        quantity: 8
    },
    {
        missionId: 25,
        propertyId :4,
        quantity: 4
    },
    {
        missionId: 26,
        propertyId :4,
        quantity: 8
    },
    {
        missionId: 26,
        propertyId :5,
        quantity: 4
    },
    {
        missionId: 27,
        propertyId :5,
        quantity: 8
    },
    {
        missionId: 27,
        propertyId :3,
        quantity: 4
    },
   // Mission9-
    {
        missionId: 28,
        propertyId :4,
        quantity: 4
    },
    {
        missionId: 28,
        propertyId :5,
        quantity: 4
    },
    {
        missionId: 29,
        propertyId :3,
        quantity: 4
    },
    {
        missionId: 29,
        propertyId :5,
        quantity: 4
    },
    {
        missionId: 30,
        propertyId :3,
        quantity: 4
    },
    {
        missionId: 30,
        propertyId :4,
        quantity: 4
    },
   // Mission10-
    {
        missionId: 31,
        propertyId :6,
        quantity: 24
    },
    {
        missionId: 32,
        propertyId :7,
        quantity: 24
    },
    {
        missionId: 33,
        propertyId :8,
        quantity: 24
    },
   // Mission11-
    {
        missionId: 34,
        propertyId :6,
        quantity: 16
    },
    {
        missionId: 34,
        propertyId :4,
        quantity: 8
    },
    {
        missionId: 35,
        propertyId :7,
        quantity: 16
    },
    {
        missionId: 35,
        propertyId :5,
        quantity: 8
    },
    {
        missionId: 36,
        propertyId :8,
        quantity: 16
    },
    {
        missionId: 36,
        propertyId :3,
        quantity: 8
    },
   // Mission12-
    {
        missionId: 37,
        propertyId :6,
        quantity: 16
    },
    {
        missionId: 37,
        propertyId :7,
        quantity: 8
    },
    {
        missionId: 38,
        propertyId :7,
        quantity: 16
    },
    {
        missionId: 38,
        propertyId :8,
        quantity: 8
    },
    {
        missionId: 39,
        propertyId :8,
        quantity: 16
    },
    {
        missionId: 39,
        propertyId :6,
        quantity: 8
    },
   // Mission13-
    {
        missionId: 40,
        propertyId :7,
        quantity: 16
    },
    {
        missionId: 40,
        propertyId :8,
        quantity: 8
    },
    {
        missionId: 41,
        propertyId :8,
        quantity: 16
    },
    {
        missionId: 41,
        propertyId :6,
        quantity: 8
    },
    {
        missionId: 42,
        propertyId :6,
        quantity: 16
    },
    {
        missionId: 42,
        propertyId :7,
        quantity: 8
    },
   // Mission14-
    {
        missionId: 43,
        propertyId :6,
        quantity: 8
    },
    {
        missionId: 43,
        propertyId :9,
        quantity: 8
    },
    {
        missionId: 44,
        propertyId :7,
        quantity: 8
    },
    {
        missionId: 44,
        propertyId :10,
        quantity: 8
    },
    {
        missionId: 45,
        propertyId :8,
        quantity: 8
    },
    {
        missionId: 45,
        propertyId :11,
        quantity: 8
    },
   // Mission15-
    {
        missionId: 46,
        propertyId :9,
        quantity: 50
    },
    {
        missionId: 47,
        propertyId :10,
        quantity: 50
    },
    {
        missionId: 48,
        propertyId :11,
        quantity: 50
    },
   // Mission16-
    {
        missionId: 49,
        propertyId :9,
        quantity: 60
    },
    {
        missionId: 49,
        propertyId :7,
        quantity: 20
    },
    {
        missionId: 50,
        propertyId :10,
        quantity: 60
    },
    {
        missionId: 50,
        propertyId :8,
        quantity: 20
    },
    {
        missionId: 51,
        propertyId :11,
        quantity: 60
    },
    {
        missionId: 51,
        propertyId :6,
        quantity: 20
    },
   // Mission17-
    {
        missionId: 52,
        propertyId :9,
        quantity: 30
    },
    {
        missionId: 52,
        propertyId :7,
        quantity: 16
    },
    {
        missionId: 52,
        propertyId :8,
        quantity: 16
    },
    {
        missionId: 53,
        propertyId :10,
        quantity: 30
    },
    {
        missionId: 53,
        propertyId :6,
        quantity: 16
    },
    {
        missionId: 53,
        propertyId :8,
        quantity: 16
    },
    {
        missionId: 54,
        propertyId :11,
        quantity: 30
    },
    {
        missionId: 54,
        propertyId :6,
        quantity: 16
    },
    {
        missionId: 54,
        propertyId :7,
        quantity: 16
    },
    // Mission18-
    {
        missionId: 55,
        propertyId :10,
        quantity: 24
    },
    {
        missionId: 55,
        propertyId :11,
        quantity: 24
    },
    {
        missionId: 56,
        propertyId :9,
        quantity: 24
    },
    {
        missionId: 56,
        propertyId :11,
        quantity: 24
    },
    {
        missionId: 57,
        propertyId :9,
        quantity: 24
    },
    {
        missionId: 57,
        propertyId :10,
        quantity: 24
    },
    // Mission19-
    {
        missionId: 58,
        propertyId :10,
        quantity: 24
    },
    {
        missionId: 58,
        propertyId :8,
        quantity: 24
    },
    {
        missionId: 58,
        propertyId :3,
        quantity: 24
    },
    {
        missionId: 59,
        propertyId :11,
        quantity: 24
    },
    {
        missionId: 59,
        propertyId :6,
        quantity: 24
    },
    {
        missionId: 59,
        propertyId :4,
        quantity: 24
    },
    {
        missionId: 60,
        propertyId :19,
        quantity: 24
    },
    {
        missionId: 60,
        propertyId :7,
        quantity: 24
    },
    {
        missionId: 60,
        propertyId :5,
        quantity: 24
    },
    // Mission20-
    {
        missionId: 61,
        propertyId :12,
        quantity: 150
    },
    {
        missionId: 62,
        propertyId :13,
        quantity: 150
    },
    {
        missionId: 63,
        propertyId :14,
        quantity: 150
    },
    // Mission21-
    {
        missionId: 64,
        propertyId :10,
        quantity: 30
    },
    {
        missionId: 64,
        propertyId :11,
        quantity: 30
    },
    {
        missionId: 65,
        propertyId :9,
        quantity: 30
    },
    {
        missionId: 65,
        propertyId :11,
        quantity: 30
    },
    {
        missionId: 66,
        propertyId :9,
        quantity: 30
    },
    {
        missionId: 66,
        propertyId :10,
        quantity: 30
    },
    // Mission22-
    {
        missionId: 67,
        propertyId :13,
        quantity: 150
    },
    {
        missionId: 68,
        propertyId :14,
        quantity: 150
    },
    {
        missionId: 69,
        propertyId :12,
        quantity: 150
    },
    // Mission23-
    {
        missionId: 70,
        propertyId :13,
        quantity: 150
    },
    {
        missionId: 70,
        propertyId :14,
        quantity: 150
    },
    {
        missionId: 71,
        propertyId :12,
        quantity: 150
    },
    {
        missionId: 71,
        propertyId :14,
        quantity: 150
    },
    {
        missionId: 72,
        propertyId :12,
        quantity: 150
    },
    {
        missionId: 72,
        propertyId :13,
        quantity: 150
    },
    // Mission24-
    {
        missionId: 73,
        propertyId :14,
        quantity: 24
    },
    {
        missionId: 73,
        propertyId :10,
        quantity: 24
    },
    {
        missionId: 73,
        propertyId :8,
        quantity: 24
    },
    {
        missionId: 74,
        propertyId :12,
        quantity: 24
    },
    {
        missionId: 74,
        propertyId :11,
        quantity: 24
    },
    {
        missionId: 74,
        propertyId :6,
        quantity: 24
    },
    {
        missionId: 75,
        propertyId :13,
        quantity: 24
    },
    {
        missionId: 75,
        propertyId :9,
        quantity: 24
    },
    {
        missionId: 75,
        propertyId :7,
        quantity: 24
    },
    // Mission25-
    {
        missionId: 76,
        propertyId :15,
        quantity: 200
    },
    {
        missionId: 77,
        propertyId :16,
        quantity: 200
    },
    {
        missionId: 78,
        propertyId :17,
        quantity: 200
    },
    // Mission26-
    {
        missionId: 79,
        propertyId :15,
        quantity: 100
    },
    {
        missionId: 79,
        propertyId :16,
        quantity: 100
    },
    {
        missionId: 80,
        propertyId :16,
        quantity: 100
    },
    {
        missionId: 80,
        propertyId :17,
        quantity: 100
    },
    {
        missionId: 81,
        propertyId :15,
        quantity: 100
    },
    {
        missionId: 81,
        propertyId :17,
        quantity: 100
    },
    // Mission27-
    {
        missionId: 82,
        propertyId :13,
        quantity: 200
    },
    {
        missionId: 82,
        propertyId :14,
        quantity: 200
    },
    {
        missionId: 83,
        propertyId :12,
        quantity: 200
    },
    {
        missionId: 83,
        propertyId :14,
        quantity: 200
    },
    {
        missionId: 84,
        propertyId :12,
        quantity: 200
    },
    {
        missionId: 84,
        propertyId :13,
        quantity: 200
    },
    // Mission28-
    {
        missionId: 85,
        propertyId :10,
        quantity: 24
    },
    {
        missionId: 85,
        propertyId :17,
        quantity: 100
    },
    {
        missionId: 86,
        propertyId :11,
        quantity: 24
    },
    {
        missionId: 86,
        propertyId :15,
        quantity: 100
    },
    {
        missionId: 87,
        propertyId :9,
        quantity: 24
    },
    {
        missionId: 87,
        propertyId :16,
        quantity: 100
    },
    // Mission29-
    {
        missionId: 88,
        propertyId :16,
        quantity: 200
    },
    {
        missionId: 88,
        propertyId :17,
        quantity: 200
    },
    {
        missionId: 89,
        propertyId :15,
        quantity: 200
    },
    {
        missionId: 89,
        propertyId :17,
        quantity: 200
    },
    {
        missionId: 90,
        propertyId :15,
        quantity: 200
    },
    {
        missionId: 90,
        propertyId :16,
        quantity: 200
    },
    // Mission30-
    {
        missionId: 91,
        propertyId :18,
        quantity: 250
    },
    {
        missionId: 92,
        propertyId :19,
        quantity: 250
    },
    {
        missionId: 93,
        propertyId :20,
        quantity: 250
    },
    // Mission31-
    {
        missionId: 94,
        propertyId :18,
        quantity: 200
    },
    {
        missionId: 94,
        propertyId :19,
        quantity: 200
    },
    {
        missionId: 95,
        propertyId :19,
        quantity: 200
    },
    {
        missionId: 95,
        propertyId :20,
        quantity: 200
    },
    {
        missionId: 96,
        propertyId :18,
        quantity: 200
    },
    {
        missionId: 96,
        propertyId :20,
        quantity: 200
    },
    // Mission32-
    {
        missionId: 97,
        propertyId :16,
        quantity: 300
    },
    {
        missionId: 97,
        propertyId :20,
        quantity: 200
    },
    {
        missionId: 98,
        propertyId :17,
        quantity: 300
    },
    {
        missionId: 98,
        propertyId :18,
        quantity: 200
    },
    {
        missionId: 99,
        propertyId :15,
        quantity: 300
    },
    {
        missionId: 99,
        propertyId :19,
        quantity: 200
    },
    // Mission33-
    {
        missionId: 100,
        propertyId :19,
        quantity: 200
    },
    {
        missionId: 100,
        propertyId :20,
        quantity: 200
    },
    {
        missionId: 101,
        propertyId :18,
        quantity: 200
    },
    {
        missionId: 101,
        propertyId :20,
        quantity: 200
    },
    {
        missionId: 102,
        propertyId :18,
        quantity: 200
    },
    {
        missionId: 102,
        propertyId :19,
        quantity: 200
    },
    // Mission34-
    {
        missionId: 103,
        propertyId :19,
        quantity: 100
    },
    {
        missionId: 103,
        propertyId :17,
        quantity: 100
    },
    {
        missionId: 104,
        propertyId :20,
        quantity: 100
    },
    {
        missionId: 104,
        propertyId :15,
        quantity: 100
    },
    {
        missionId: 105,
        propertyId :18,
        quantity: 100
    },
    {
        missionId: 105,
        propertyId :16,
        quantity: 100
    },
    // Mission35-
    {
        missionId: 106,
        propertyId :21,
        quantity: 300
    },
    {
        missionId: 107,
        propertyId :22,
        quantity: 300
    },
    {
        missionId: 108,
        propertyId :23,
        quantity: 300
    },
    // Mission36-
    {
        missionId: 109,
        propertyId :16,
        quantity: 100
    },
    {
        missionId: 109,
        propertyId :19,
        quantity: 200
    },
    {
        missionId: 110,
        propertyId :17,
        quantity: 100
    },
    {
        missionId: 110,
        propertyId :20,
        quantity: 200
    },
    {
        missionId: 111,
        propertyId :15,
        quantity: 100
    },
    {
        missionId: 111,
        propertyId :18,
        quantity: 200
    },
    // Mission37-
    {
        missionId: 112,
        propertyId :21,
        quantity: 100
    },
    {
        missionId: 112,
        propertyId :22,
        quantity: 300
    },
    {
        missionId: 113,
        propertyId :22,
        quantity: 100
    },
    {
        missionId: 113,
        propertyId :23,
        quantity: 300
    },
    {
        missionId: 114,
        propertyId :21,
        quantity: 300
    },
    {
        missionId: 114,
        propertyId :23,
        quantity: 100
    },
    // Mission38-
    {
        missionId: 115,
        propertyId :22,
        quantity: 360
    },
    {
        missionId: 115,
        propertyId :23,
        quantity: 360
    },
    {
        missionId: 116,
        propertyId :21,
        quantity: 360
    },
    {
        missionId: 116,
        propertyId :23,
        quantity: 360
    },
    {
        missionId: 117,
        propertyId :21,
        quantity: 360
    },
    {
        missionId: 117,
        propertyId :22,
        quantity: 360
    },
    // Mission39-
    {
        missionId: 118,
        propertyId :19,
        quantity: 160
    },
    {
        missionId: 118,
        propertyId :17,
        quantity: 160
    },
    {
        missionId: 118,
        propertyId :13,
        quantity: 100
    },
    {
        missionId: 119,
        propertyId :20,
        quantity: 160
    },
    {
        missionId: 119,
        propertyId :15,
        quantity: 160
    },
    {
        missionId: 119,
        propertyId :14,
        quantity: 100
    },
    {
        missionId: 120,
        propertyId :18,
        quantity: 160
    },
    {
        missionId: 120,
        propertyId :16,
        quantity: 160
    },
    {
        missionId: 120,
        propertyId :12,
        quantity: 100
    },
    // Mission40-
    {
        missionId: 121,
        propertyId :24,
        quantity: 350
    },
    {
        missionId: 122,
        propertyId :25,
        quantity: 350
    },
    {
        missionId: 123,
        propertyId :26,
        quantity: 350
    },
    // Mission41-
    {
        missionId: 124,
        propertyId :19,
        quantity: 360
    },
    {
        missionId: 124,
        propertyId :23,
        quantity: 360
    },
    {
        missionId: 125,
        propertyId :20,
        quantity: 360
    },
    {
        missionId: 125,
        propertyId :21,
        quantity: 360
    },
    {
        missionId: 126,
        propertyId :18,
        quantity: 360
    },
    {
        missionId: 126,
        propertyId :22,
        quantity: 360
    },
    // Mission42-
    {
        missionId: 127,
        propertyId :22,
        quantity: 400
    },
    {
        missionId: 127,
        propertyId :23,
        quantity: 400
    },
    {
        missionId: 128,
        propertyId :21,
        quantity: 400
    },
    {
        missionId: 128,
        propertyId :23,
        quantity: 400
    },
    {
        missionId: 129,
        propertyId :21,
        quantity: 400
    },
    {
        missionId: 129,
        propertyId :22,
        quantity: 400
    },
    // Mission43-
    {
        missionId: 130,
        propertyId :25,
        quantity: 360
    },
    {
        missionId: 130,
        propertyId :26,
        quantity: 300
    },
    {
        missionId: 130,
        propertyId :22,
        quantity: 100
    },
    {
        missionId: 131,
        propertyId :24,
        quantity: 360
    },
    {
        missionId: 131,
        propertyId :26,
        quantity: 300
    },
    {
        missionId: 131,
        propertyId :23,
        quantity: 100
    },
    {
        missionId: 132,
        propertyId :24,
        quantity: 360
    },
    {
        missionId: 132,
        propertyId :25,
        quantity: 300
    },
    {
        missionId: 132,
        propertyId :21,
        quantity: 100
    },
   // Mission44-
    {
        missionId: 133,
        propertyId :25,
        quantity: 400
    },
    {
        missionId: 133,
        propertyId :18,
        quantity: 400
    },
    {
        missionId: 133,
        propertyId :20,
        quantity: 200
    },
    {
        missionId: 134,
        propertyId :26,
        quantity: 400
    },
    {
        missionId: 134,
        propertyId :19,
        quantity: 400
    },
    {
        missionId: 134,
        propertyId :18,
        quantity: 200
    },
    {
        missionId: 135,
        propertyId :24,
        quantity: 400
    },
    {
        missionId: 135,
        propertyId :20,
        quantity: 400
    },
    {
        missionId: 135,
        propertyId :19,
        quantity: 200
    },

];

export const callPromise = (method, contract, contractMethod, args) => {
  return new Promise((resolve, reject) => {
    Meteor.call(method, contract, contractMethod, args,  (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
}


function init(event){
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      //sweetAlert("Oops...", "There was an error fetching your accounts.", "error");
      Session.set('account', "Wallet Not Found");
      return;
    }

    if (accs.length == 0) {
      //sweetAlert("Oops...", "Couldn't get any accounts! Make sure your Ethereum client is configured correctly.", "error");
      Session.set('account', "Account Not Found");
      return;
    }

    accounts = accs;
    account = accounts[currentAccount];
    Session.set('account', account);
    //alert(account)
  });
}

function initGameConfig(){

    //for(var i = 0; i < MissionList.length; i++){
    //    GameCoreInstance.addMission(MissionList[i].name, MissionList[i].exp, MissionList[i].lvl_limitation, MissionList[i].status,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    //}
    //for(var i = 0; i < missionItem.length; i++){
    //    GameCoreInstance.addMissionItem(missionItem[i].missionId, missionItem[i].propertyId, missionItem[i].quantity, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    //}
    console.log("Mission added");

    for (var i = 0 ; i < cropTypeList.length ; i++){
       usingPropertyInstance.addPropertyType(cropTypeList[i].name, cropTypeList[i].img, cropTypeList[i].time, cropTypeList[i].count, { from:web3.eth.accounts[currentAccount], gas:2500000});
    }

    for (var i = 0 ; i < landTypeList.length ; i++){
        usingPropertyInstance.addLandType(landTypeList[i].name, landTypeList[i].img, landTypeList[i].count, { from:web3.eth.accounts[currentAccount], gas:2000000});
    }


    //var length = usingPropertyInstance.getPropertyTypeLength({ from:web3.eth.accounts[currentAccount]});
    //usingPropertyInstance.updatePropertyTypeRating(length, 0, "new", { from:web3.eth.accounts[currentAccount], gas:2000000});

    //for(var i = 0; i < length; i++){
    //    usingPropertyInstance.initUserProperty(i, { from:web3.eth.accounts[currentAccount], gas:2000000});
    //}
    console.log("Init Complete");


}

function toHex(str) {
	var hex = '';
  var finalHex = '0x';

  for (var i = 0 ; i < str.length; i++){
    hex += ''+str.charCodeAt(i).toString(16);
  }

  for(var i=30;i > 0;i--) {
    if (i > hex.length){
      finalHex+= "0".toString(16);

    }else{
      finalHex += hex;
      break;
    }
  }
  console.log(web3.toHex(str));
  console.log(finalHex);
  console.log(parseInt(finalHex, 16));
	return finalHex;
}




Template.index.created = async function() {
    $.getScript('scripts/buttons.js');
    var temp = await callPromise('callContract', 'Congress', 'getStakeholdersLength', []);
    console.log(temp);



    // for (var i = 0 ; i < 1 ; i++){
    //   await(Meteor.call('updateContract', 'GameCore', 'addMission', [toHex(MissionList[i].name), MissionList[i].exp, MissionList[i].lvl_limitation, MissionList[i].status]));
    // }


    // init();
    // Session.set('currentAccount', currentAccount);
    // Session.set('cropsPerLvl', cropsPerLvl);
    //
    // if (Session.get('account') == "Account Not Found" || Session.get('account') == "Wallet Not Found"){
    //     return false;
    // };
    //
    // try{
    //   var val = usingPropertyInstance.propertyTypeList(0);
    //   console.log("=========== Data Inited ===========");
    //
    // }
    // catch(err){
    //   initGameConfig();
    //   console.log(err);
    // }

    //for(var i = 0; i < 70; i++){
    //    GameCoreInstance.addMission(MissionList[i].name, MissionList[i].exp, MissionList[i].lvl_limitation, MissionList[i].status,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    //}
    //for(var i = 70; i < MissionList.length; i++){
    //    GameCoreInstance.addMission(MissionList[i].name, MissionList[i].exp, MissionList[i].lvl_limitation, MissionList[i].status,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    //}

    //for(var i = 70; i < 140; i++){
    //    GameCoreInstance.addMissionItem(missionItem[i].missionId, missionItem[i].propertyId, missionItem[i].quantity, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    //}
    //for(var i = 140; i < 210; i++){
    //    GameCoreInstance.addMissionItem(missionItem[i].missionId, missionItem[i].propertyId, missionItem[i].quantity, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    //}
    //for(var i = 210; i < missionItem.length; i++){
    //    GameCoreInstance.addMissionItem(missionItem[i].missionId, missionItem[i].propertyId, missionItem[i].quantity, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    //}
}
