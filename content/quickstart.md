---
bref: ""
date: 2017-05-16T15:58:18+01:00
description: ""
draft: false
menu:
  sidenav:
    pre: <i class='fa fa-fw fa-rocket'></i>
  topnav:
    name: quickstart
    identifier: quickstart
    weight: -200
sidebar: sidenav
title: "Quickstart"
toc: true
weight: 20
---

We aim to make it as simple as possible for users to try out Syndesis. If you want to try out locally on your laptop, follow the [Minishift]({{< relref "#minishift" >}}) instructions.

## Minishift

Minishift is a tool that helps you run OpenShift locally by running a single-node OpenShift cluster inside a VM locally. With Minishift you can easily try out Syndesis without requiring a "real" cluster or servers, a laptop will suffice.

### Prerequisites

#### Minishift

You're going to need a working Minishift installation, which is really easy. If you haven't got minishift already installed, please follow the [Minishift installation documentation](https://docs.openshift.org/latest/minishift/getting-started/installing.html).

#### GitHub registered application

The other prerequisite is that you have a GitHub application registered at https://github.com/settings/developers. For the registration, please use as callback URL the output of `https://syndesis.$(minishift ip).xip.io`. Then you get a `<GITHUB_CLIENT_ID>` and a `<GITHUB_CLIENT_SECRET>`. These should be used in the commands below.

### Template selection

The template to use in the installation instructions depend on your use case:

* **Developer** : Use the template `syndesis-dev` which directly references Docker images without image streams. Then when before building you images e.g. with `mvn fabric8:build` set your `DOCKER_HOST` envvar to use the Minishift Docker daemon via `eval $(minishift docker-env)`. After you have created a new image you simply only need to kill the appropriate pod so that the new pod spinning up will use the freshly created image. 

* **Tester** / **User** : In case you only want to have the latest version of Syndesis on your local Minishift installation, use the template `syndesis` which uses image stream refering to the published Docker Hub images. Minishift will update its images and trigger a redeployment when the images at Docker Hub changes. Therefor it checks every 15 minutes for a change image. You do not have to do anything to get your application updated except for waiting on Minishift to pick up ew images.

Depending on your role please use the appropriate template in the instructions below.

### Deployment instructions

Fire up minishift if not already running. Please note that we need v1.5.0 right now
for auto creating volumes. Alternatively you could use the provided script tools/create-pv-minishift.sh
to create the PV on your own. Also, you need to add some memory, 4192 or more is recommended

```bash
$ minishift start --openshift-version=v1.5.0 --memory 4192 --cpus 2
```

Tip: If you want to switch the OpenShift config permanently use:

```bash
$ minishift config set openshift-version 1.5.0
$ minishift config set memory 4192
$ minishift config set cpus 2
```

Set your GitHub credentials from your [registered app]({{< relref "#github-registered-application" >}}) in your shell:

```bash
$ export GITHUB_CLIENT_ID=...
$ export GITHUB_CLIENT_SECRET=...
```

Install the OpenShift template (syndesis-dev.yml or syndesis.yml as discussed [above]({{< relref "#template-selection" >}})):

```bash
$ oc create -f https://raw.githubusercontent.com/syndesisio/openshift-templates/master/syndesis-dev.yml
```

Deploy syndesis using the following command, replacing "syndesis-dev" with "syndesis" depending on the template
you have just installed:

```bash
$ oc new-app syndesis-dev \
    -p ROUTE_HOSTNAME=syndesis.$(minishift ip).xip.io \
    -p OPENSHIFT_MASTER=$(oc whoami --show-server) \
    -p GITHUB_OAUTH_CLIENT_ID=${GITHUB_CLIENT_ID} \
    -p GITHUB_OAUTH_CLIENT_SECRET=${GITHUB_CLIENT_SECRET} \
    -p INSECURE_SKIP_VERIFY=true
```

Wait until all pods are running:

```bash
$ watch oc get pods
```

You should now be able to open `https://syndesis.$(minishift ip).xip.io` in your browser.